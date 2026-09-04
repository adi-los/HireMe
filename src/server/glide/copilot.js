import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import * as llmClient from './llm-client.js'
import { writeAudit, ACTIONS } from './audit.js'
import { buildContext, buildSystemPrompt, buildUserPrompt, parseAssistantReply } from '../copilot-prompt.js'

/**
 * RH Copilot orchestration (blueprint p.12). Loads exactly ONE application's
 * data, asks the LLM, records both turns, and returns the answer.
 *
 * Scoping (ai-agents-brief.md Q4): this function takes a single
 * `applicationId` and only ever reads records that hang off it — there is no
 * code path here that can pull in a second candidate. Runs as the invoking
 * recruiter's own session (Scripted REST default), so every GlideRecord read
 * is still gated by that recruiter's own ACLs on top of this scoping.
 */
export function answerRecruiterQuestion(applicationId, question) {
    if (!applicationId) return { error: 'application_id is required' }
    const trimmedQuestion = buildUserPrompt(question)
    if (!trimmedQuestion) return { error: 'question is required' }

    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) return { error: 'application not found' }

    // Write the recruiter's question first, unconditionally, so it's never
    // silently lost — including when the LLM isn't configured or a later
    // call fails. This is also the transcript's audit trail: "this was
    // asked" is worth keeping even on a turn with no answer.
    writeChatRow(applicationId, 'user', trimmedQuestion, null)

    if (!llmClient.isConfigured()) {
        return { error: 'AI is not configured on this instance. Set x_winu_hireme.llm.provider and x_winu_hireme.llm.api_key.' }
    }

    const context = buildContext(loadContextFields(app))

    let reply
    try {
        const systemPrompt = buildSystemPrompt(context)
        const rawReply = llmClient.complete({ system: systemPrompt, user: trimmedQuestion })
        reply = parseAssistantReply(rawReply)
    } catch (err) {
        gs.error('[HireMe] Copilot LLM call failed for application ' + applicationId + ': ' + err)
        return { error: 'The AI request failed. Try again in a moment.' }
    }

    writeChatRow(applicationId, 'assistant', reply.answer, reply.citations)

    writeAudit({
        action: ACTIONS.COPILOT_QUERY,
        application: applicationId,
        actorType: 'user',
        reason: 'RH Copilot question',
        details: { question: trimmedQuestion, citations: reply.citations },
    })

    return { answer: reply.answer, citations: reply.citations }
}

function loadContextFields(app) {
    const candidate = new GlideRecord('x_winu_hireme_candidate')
    const gotCandidate = candidate.get(app.getValue('candidate_ref'))

    const jobOffer = new GlideRecord('x_winu_hireme_job_offer')
    const gotJobOffer = jobOffer.get(app.getValue('joboffer_ref'))

    const cv = new GlideRecord('x_winu_hireme_cv_document')
    cv.addQuery('application_ref', app.getUniqueValue())
    cv.setLimit(1)
    cv.query()
    const gotCv = cv.next()

    const profile = new GlideRecord('x_winu_hireme_candidate_profile')
    profile.addQuery('application_ref', app.getUniqueValue())
    profile.setLimit(1)
    profile.query()
    const gotProfile = profile.next()

    const score = new GlideRecord('x_winu_hireme_scoring_result')
    score.addQuery('application_ref', app.getUniqueValue())
    score.addQuery('is_current', 'true')
    score.setLimit(1)
    score.query()
    const gotScore = score.next()

    let breakdown = null
    if (gotScore) {
        try {
            breakdown = JSON.parse(score.getValue('breakdown_json') || 'null')
        } catch (e) {
            breakdown = null
        }
    }

    return {
        applicationNumber: app.getValue('number'),
        applicationStatus: app.getValue('status'),
        finalDecision: app.getValue('final_decision'),
        candidateName: gotCandidate ? candidate.getValue('full_name') : null,
        jobTitle: gotJobOffer ? jobOffer.getValue('title') : null,
        jobDepartment: gotJobOffer ? jobOffer.getValue('department') : null,
        jobRequirements: gotJobOffer ? safeJson(jobOffer.getValue('requirements')) : null,
        cvFileName: gotCv ? cv.getValue('file_name') : null,
        cvOcrStatus: gotCv ? cv.getValue('ocr_status') : null,
        cvRawText: gotCv ? cv.getValue('raw_text') : null,
        profileSkills: gotProfile ? safeJson(profile.getValue('skills')) : null,
        profileExperienceYears: gotProfile ? profile.getValue('experience_years') : null,
        profileEducation: gotProfile ? profile.getValue('education') : null,
        profileDataConfidence: gotProfile ? profile.getValue('data_confidence') : null,
        score: gotScore
            ? {
                  value: score.getValue('score'),
                  category: score.getValue('category'),
                  breakdown: breakdown,
              }
            : null,
    }
}

function safeJson(raw) {
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch (e) {
        return null
    }
}

function writeChatRow(applicationId, role, message, citations) {
    const row = new GlideRecord('x_winu_hireme_chat_interaction')
    row.initialize()
    row.setValue('application_ref', applicationId)
    row.setValue('actor', gs.getUserID())
    row.setValue('role', role)
    row.setValue('channel', 'rh_copilot')
    row.setValue('message', message)
    if (citations) {
        try {
            row.setValue('citations', JSON.stringify(citations))
        } catch (e) {
            // citations are best-effort metadata; never block the chat row on this
        }
    }
    row.setValue('timestamp', new GlideDateTime().getValue())
    return row.insert()
}

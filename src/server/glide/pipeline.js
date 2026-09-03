import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { parseProfile } from '../profile-parser.js'
import { evaluate } from '../matching.js'
import { computeScore, blendInterviewScore, slaHoursFor } from '../scoring.js'
import { writeAudit, ACTIONS } from './audit.js'
import { getScoringOptions, config } from './config.js'

/**
 * The recruitment pipeline, server side (blueprint p.05).
 *
 *   CV text  →  parseProfile      →  CandidateProfile
 *   profile  →  evaluate          →  five criterion sub-scores
 *   scores   →  computeScore      →  ScoringResult + category
 *
 * Each step is separately callable so a flow, a business rule, a REST callback
 * or an admin re-run can enter at any point.
 */

function safeJsonParse(raw, fallback) {
    if (!raw) return fallback
    try {
        const v = JSON.parse(raw)
        return v == null ? fallback : v
    } catch (e) {
        return fallback
    }
}

/** Read a job offer's structured requirements from an application. */
export function getRequirementsForApplication(applicationId) {
    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) return null

    const offer = new GlideRecord('x_winu_hireme_job_offer')
    if (!offer.get(app.getValue('joboffer_ref'))) return {}
    return safeJsonParse(offer.getValue('requirements'), {})
}

/** Skill names a job offer asks for — used to widen the parser vocabulary. */
function requiredSkillNames(requirements) {
    const skills = requirements && Array.isArray(requirements.skills) ? requirements.skills : []
    const names = []
    for (let i = 0; i < skills.length; i++) {
        const s = skills[i]
        const name = typeof s === 'string' ? s : s && s.name
        if (name) names.push(String(name))
    }
    return names
}

/**
 * Step 4 — turn a completed OCR extraction into a CandidateProfile.
 * Idempotent: re-running replaces the profile for that application.
 *
 * @returns {string|null} sys_id of the profile
 */
export function buildProfileFromCv(cvDocumentId) {
    const cv = new GlideRecord('x_winu_hireme_cv_document')
    if (!cv.get(cvDocumentId)) {
        gs.error('[HireMe] buildProfileFromCv: no CV document ' + cvDocumentId)
        return null
    }

    const applicationId = cv.getValue('application_ref')
    const rawText = cv.getValue('raw_text')
    if (!rawText) {
        gs.warn('[HireMe] CV ' + cvDocumentId + ' has no raw_text; nothing to parse')
        return null
    }

    const requirements = getRequirementsForApplication(applicationId) || {}
    const parsed = parseProfile(rawText, requiredSkillNames(requirements))

    // One current profile per application: update in place if it exists.
    const profile = new GlideRecord('x_winu_hireme_candidate_profile')
    profile.addQuery('application_ref', applicationId)
    profile.setLimit(1)
    profile.query()

    const isUpdate = profile.next()
    if (!isUpdate) {
        profile.initialize()
        profile.setValue('application_ref', applicationId)
    }

    profile.setValue('skills', JSON.stringify(parsed.skills))
    profile.setValue('experience_years', parsed.experience_years)
    profile.setValue('education', parsed.education)
    profile.setValue('past_roles', JSON.stringify(parsed.soft_skills))
    profile.setValue('data_confidence', parsed.data_confidence)
    profile.setValue('parser_version', parsed.parser_version)

    let profileId
    if (isUpdate) {
        profile.update()
        profileId = profile.getUniqueValue()
    } else {
        profileId = profile.insert()
    }

    writeAudit({
        action: ACTIONS.PROFILE_PARSED,
        application: applicationId,
        actorType: 'system',
        reason: 'Parsed CV into structured profile',
        details: {
            parser_version: parsed.parser_version,
            data_confidence: parsed.data_confidence,
            skills_found: parsed.skills.length,
            experience_source: parsed.experience_source,
        },
    })

    return profileId
}

/** Load a profile back into the plain shape the matcher expects. */
function loadProfile(applicationId) {
    const gr = new GlideRecord('x_winu_hireme_candidate_profile')
    gr.addQuery('application_ref', applicationId)
    gr.orderByDesc('sys_created_on')
    gr.setLimit(1)
    gr.query()
    if (!gr.next()) return null

    // education_level is derived from the stored label rather than stored twice.
    const labels = { Doctorate: 5, Master: 4, Bachelor: 3, Associate: 2, Secondary: 1 }
    const label = gr.getValue('education')

    return {
        skills: safeJsonParse(gr.getValue('skills'), []),
        experience_years: parseInt(gr.getValue('experience_years'), 10) || 0,
        education: label,
        education_level: labels[label] || 0,
        soft_skills: safeJsonParse(gr.getValue('past_roles'), []),
        data_confidence: parseFloat(gr.getValue('data_confidence')) || 0,
    }
}

/**
 * Steps 5 & 6 — score the application and assign a category.
 *
 * Always inserts a NEW ScoringResult and demotes the previous one, so the
 * audit trail keeps every verdict (p.11). Never updates in place.
 *
 * @returns {{score:number, category:string, scoringResultId:string}|null}
 */
export function scoreApplication(applicationId, options) {
    const opts = options || {}
    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) {
        gs.error('[HireMe] scoreApplication: no application ' + applicationId)
        return null
    }

    const profile = loadProfile(applicationId)
    if (!profile) {
        gs.warn('[HireMe] scoreApplication: no profile yet for ' + applicationId)
        return null
    }

    const requirements = getRequirementsForApplication(applicationId) || {}
    const assessment = evaluate(profile, requirements)

    // The LLM refines the deterministic sub-scores; it never replaces the
    // arithmetic, and a failure here leaves the rule-based result standing.
    let criteria = assessment.criteria
    let source = 'rules'
    if (config.useLlm()) {
        const refined = refineWithLlm(profile, requirements, assessment)
        if (refined) {
            criteria = refined
            source = 'llm'
        }
    }

    const scoringOptions = getScoringOptions()
    const result = computeScore(criteria, assessment.data_confidence, scoringOptions)

    const scoringResultId = insertScoringResult(applicationId, result, {
        source: source,
        evidence: assessment.evidence,
        rules_criteria: assessment.criteria,
    })

    // Category drives the queue; status moves Received → Screened (p.05 step 6).
    if (app.getValue('status') === 'received') {
        app.setValue('status', 'screened')
        app.update()
    }

    writeAudit({
        action: opts.isRescore ? ACTIONS.RESCORED : ACTIONS.SCORED,
        application: applicationId,
        actorType: source === 'llm' ? 'ai' : 'system',
        reason: 'Scored ' + result.score + ' → ' + result.category,
        details: {
            score: result.score,
            category: result.category,
            model_version: scoringOptions.modelVersion,
            source: source,
            review_sla_hours: slaHoursFor(result.category),
            breakdown: result.breakdown,
        },
    })

    return { score: result.score, category: result.category, scoringResultId: scoringResultId }
}

/** Insert a new current ScoringResult, demoting any previous one. */
function insertScoringResult(applicationId, result, extra) {
    const prior = new GlideRecord('x_winu_hireme_scoring_result')
    prior.addQuery('application_ref', applicationId)
    prior.addQuery('is_current', 'true')
    prior.query()
    while (prior.next()) {
        prior.setValue('is_current', 'false')
        prior.update()
    }

    const breakdown = result.breakdown || {}
    if (extra) {
        breakdown.source = extra.source
        breakdown.evidence = extra.evidence
        // Keep the deterministic baseline next to the final numbers so an
        // LLM-refined score can always be compared against the rules.
        if (extra.source === 'llm') breakdown.rules_criteria = extra.rules_criteria
    }

    const row = new GlideRecord('x_winu_hireme_scoring_result')
    row.initialize()
    row.setValue('application_ref', applicationId)
    row.setValue('score', result.score)
    row.setValue('category', result.category)
    row.setValue('breakdown_json', JSON.stringify(breakdown))
    row.setValue('model_version', breakdown.model_version || 'unset')
    row.setValue('scored_at', new GlideDateTime().getValue())
    row.setValue('is_current', 'true')
    return row.insert()
}

/**
 * Ask the platform LLM to refine the five sub-scores.
 *
 * Uses `sn_generative_ai.LLMClient`, which needs no AI Agent Studio licence.
 * Returns null on any problem so the caller keeps the rule-based scores —
 * this path is an enhancement, never a dependency.
 */
export function refineWithLlm(profile, requirements, assessment) {
    try {
        // Guarded at runtime: the namespace only exists on instances with
        // generative AI enabled. `typeof` on an undeclared identifier is safe
        // and is the only way to probe for it without a hard dependency.
        if (typeof sn_generative_ai === 'undefined' || !sn_generative_ai.LLMClient) {
            gs.warn('[HireMe] scoring.use_llm is on but sn_generative_ai is unavailable; using rule-based scores')
            return null
        }

        const prompt =
            'You are scoring a job candidate. Return ONLY a JSON object with numeric keys ' +
            'skills_match, experience_relevance, education_fit, soft_skills_signal, logistics_fit, ' +
            'each an integer 0-100. Do not explain.\n\n' +
            'JOB REQUIREMENTS:\n' + JSON.stringify(requirements) + '\n\n' +
            'CANDIDATE PROFILE:\n' + JSON.stringify(profile) + '\n\n' +
            'RULE-BASED BASELINE (adjust only where clearly wrong):\n' +
            JSON.stringify(assessment.criteria)

        const client = new sn_generative_ai.LLMClient()
        const response = client.call({ prompt: prompt })
        if (!response || response.status !== 'Success') {
            gs.warn('[HireMe] LLM scoring returned no usable response; keeping rule-based scores')
            return null
        }

        const match = String(response.response).match(/\{[\s\S]*\}/)
        if (!match) return null
        const parsed = JSON.parse(match[0])

        const keys = ['skills_match', 'experience_relevance', 'education_fit', 'soft_skills_signal', 'logistics_fit']
        const out = {}
        for (let i = 0; i < keys.length; i++) {
            const v = parsed[keys[i]]
            // Anything the model got wrong falls back to the rule-based number.
            out[keys[i]] = typeof v === 'number' && !isNaN(v) ? Math.max(0, Math.min(100, v)) : assessment.criteria[keys[i]]
        }
        return out
    } catch (e) {
        gs.warn('[HireMe] LLM scoring failed, keeping rule-based scores: ' + e)
        return null
    }
}

/**
 * Blend a completed AI interview into the score (p.14).
 * Only acts on a completed session; writes a new current ScoringResult.
 */
export function applyInterviewScore(interviewSessionId) {
    const session = new GlideRecord('x_winu_hireme_interview_session')
    if (!session.get(interviewSessionId)) return null
    if (session.getValue('status') !== 'completed') {
        gs.info('[HireMe] interview ' + interviewSessionId + ' is not completed; original score stands')
        return null
    }

    const applicationId = session.getValue('application_ref')
    const current = new GlideRecord('x_winu_hireme_scoring_result')
    current.addQuery('application_ref', applicationId)
    current.addQuery('is_current', 'true')
    current.setLimit(1)
    current.query()
    if (!current.next()) return null

    const original = parseInt(current.getValue('score'), 10) || 0
    const subscore = parseInt(session.getValue('ai_subscore'), 10) || 0
    const blended = blendInterviewScore(original, subscore)

    blended.breakdown.model_version = current.getValue('model_version')
    const scoringResultId = insertScoringResult(applicationId, blended, { source: 'interview_blend' })

    writeAudit({
        action: ACTIONS.INTERVIEW_BLENDED,
        application: applicationId,
        actorType: 'system',
        reason: 'Blended interview ' + subscore + ' into ' + original + ' → ' + blended.score,
        details: blended.breakdown,
    })

    return { score: blended.score, category: blended.category, scoringResultId: scoringResultId }
}

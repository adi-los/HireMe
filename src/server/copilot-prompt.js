/**
 * Pure prompt construction + response parsing for the RH Copilot
 * (blueprint p.12). No Glide — takes plain data, returns plain data, so it
 * is unit-testable offline like scoring.js/matching.js.
 *
 * Grounding rule (ai-agents-brief.md Q4 / blueprint p.12): the Copilot must
 * answer only from the one application it is scoped to, and must cite which
 * field(s) an answer came from. Both are enforced here, in the prompt text
 * itself — the model has no other data to draw from, since
 * `src/server/glide/copilot.js` never puts a second application in context.
 */

export function buildSystemPrompt(context) {
    const lines = [
        'You are the HireMe RH Copilot, an assistant for a recruiter reviewing ONE job application.',
        'Answer only using the CONTEXT below. Never invent facts, and never compare this candidate to any other candidate.',
        'If the answer is not in the context, say so plainly instead of guessing.',
        'Respond with a single JSON object, no other text: {"answer": string, "citations": string[]}.',
        '"citations" lists which context field(s) the answer came from, e.g. ["profile.skills", "score.breakdown_json.skills_match"].',
        '',
        'CONTEXT:',
        JSON.stringify(context, null, 2),
    ]
    return lines.join('\n')
}

export function buildUserPrompt(question) {
    return String(question || '').trim()
}

/**
 * Parse the model's reply. Falls back to treating the whole reply as the
 * answer with no citations if it didn't return the requested JSON shape —
 * a malformed reply should degrade to "less structured", never to a crash
 * or a lost answer.
 */
export function parseAssistantReply(rawText) {
    if (!rawText) return { answer: '', citations: [] }

    const jsonMatch = String(rawText).match(/\{[\s\S]*\}/)
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed && typeof parsed.answer === 'string') {
                return {
                    answer: parsed.answer,
                    citations: Array.isArray(parsed.citations) ? parsed.citations.filter(function (c) { return typeof c === 'string' }) : [],
                }
            }
        } catch (e) {
            // fall through to the plain-text fallback below
        }
    }
    return { answer: String(rawText).trim(), citations: [] }
}

/**
 * Builds the grounding context object for one application. Takes plain
 * field values already read by the caller (GlideRecord access is the
 * caller's job — see `src/server/glide/copilot.js`), so this stays pure.
 */
export function buildContext(fields) {
    return {
        application: {
            number: fields.applicationNumber,
            status: fields.applicationStatus,
            final_decision: fields.finalDecision || null,
        },
        candidate: {
            name: fields.candidateName,
        },
        job_offer: {
            title: fields.jobTitle,
            department: fields.jobDepartment,
            requirements: fields.jobRequirements || null,
        },
        cv: {
            file_name: fields.cvFileName || null,
            ocr_status: fields.cvOcrStatus || null,
            raw_text: fields.cvRawText ? truncate(fields.cvRawText, 6000) : null,
        },
        profile: {
            skills: fields.profileSkills || null,
            experience_years: fields.profileExperienceYears != null ? fields.profileExperienceYears : null,
            education: fields.profileEducation || null,
            data_confidence: fields.profileDataConfidence != null ? fields.profileDataConfidence : null,
        },
        score: fields.score
            ? {
                  value: fields.score.value,
                  category: fields.score.category,
                  breakdown: fields.score.breakdown || null,
              }
            : null,
    }
}

function truncate(text, maxChars) {
    const s = String(text)
    return s.length > maxChars ? s.slice(0, maxChars) + '…(truncated)' : s
}

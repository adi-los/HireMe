import { answerRecruiterQuestion } from '../glide/copilot.js'

/**
 * Thin HTTP adapter over `src/server/glide/copilot.js`, same pattern as
 * `src/server/rest/candidate-portal.js`: parse the request, call the
 * business function, map the result to a status code.
 */

function readJsonBody(request) {
    try {
        return JSON.parse(request.body.dataString)
    } catch (e) {
        return null
    }
}

export function handleAsk(request, response) {
    const body = readJsonBody(request)
    if (!body) return badRequest(response, 'Request body is not valid JSON')

    const result = answerRecruiterQuestion(body.application_id, body.question)
    if (result.error) {
        // "AI not configured" and "not found" both surface as 4xx-shaped
        // errors the chat UI can show inline, never a silent 500.
        response.setStatus(result.error.indexOf('not configured') >= 0 ? 503 : 400)
        response.setBody({ error: result.error })
        return
    }

    response.setStatus(200)
    response.setBody({ answer: result.answer, citations: result.citations })
}

function badRequest(response, message) {
    response.setStatus(400)
    response.setBody({ error: message })
}

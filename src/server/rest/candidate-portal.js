import { submitApplication, registerInterest, getApplicationStatus } from '../glide/intake.js'

/**
 * Thin HTTP adapters over `src/server/glide/intake.js`. Each handler only
 * parses the request, calls the pure(ish) intake function, and maps the
 * result to a status code — no business logic lives here.
 */

function readJsonBody(request) {
    try {
        return JSON.parse(request.body.dataString)
    } catch (e) {
        return null
    }
}

export function handleApply(request, response) {
    const body = readJsonBody(request)
    if (!body) return badRequest(response, 'Request body is not valid JSON')

    const result = submitApplication(body)
    if (result.error) return badRequest(response, result.error)

    response.setStatus(201)
    response.setBody({
        application_id: result.applicationId,
        access_token: result.accessToken,
        cv_document_id: result.cvDocumentId,
    })
}

export function handleInterest(request, response) {
    const body = readJsonBody(request)
    if (!body) return badRequest(response, 'Request body is not valid JSON')

    const result = registerInterest(body)
    if (result.error) return badRequest(response, result.error)

    response.setStatus(201)
    response.setBody({ candidate_id: result.candidateId })
}

export function handleStatus(request, response) {
    const applicationId = request.pathParams.application_id
    // queryParams values are arrays (a query key can repeat); this defends
    // the string-value case too, since it's undocumented in this SDK's own
    // reference and only established by general platform convention.
    const tokenParam = request.queryParams.access_token
    const accessToken = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam

    const result = getApplicationStatus(applicationId, accessToken)
    if (result.error) {
        response.setStatus(404)
        response.setBody({ error: 'not found' })
        return
    }

    response.setStatus(200)
    response.setBody(result)
}

function badRequest(response, message) {
    response.setStatus(400)
    response.setBody({ error: message })
}

import { gs, GlideRecord } from '@servicenow/glide'
import { config } from '../glide/config.js'

/**
 * OCR webhook handler (blueprint p.06 step 3).
 *
 * Wired as a route script in `src/fluent/integrations/ocr-webhook.now.ts`.
 * Two layers of defense: the route's own ACL requires
 * `x_winu_hireme.integration` (a caller must authenticate), AND the body must
 * carry the shared secret from `x_winu_hireme.ocr.callback_token`. Either one
 * alone is a single point of failure — a leaked service-account credential,
 * or a leaked token — so both are required.
 *
 * Expected body:
 * {
 *   "cv_document_id": "<sys_id>",
 *   "callback_token": "<shared secret>",
 *   "status": "complete" | "failed",
 *   "raw_text": "...",           // when status = complete
 *   "error": "..."               // when status = failed
 * }
 */
export function handleOcrCallback(request, response) {
    let body
    try {
        body = JSON.parse(request.body.dataString)
    } catch (e) {
        return respondError(response, 400, 'Request body is not valid JSON')
    }

    const expectedToken = config.ocrCallbackToken()
    if (!expectedToken || body.callback_token !== expectedToken) {
        gs.warn('[HireMe] OCR callback rejected: bad or missing callback_token')
        return respondError(response, 401, 'Invalid callback token')
    }

    if (!body.cv_document_id) return respondError(response, 400, 'cv_document_id is required')

    const cv = new GlideRecord('x_winu_hireme_cv_document')
    if (!cv.get(body.cv_document_id)) return respondError(response, 404, 'Unknown cv_document_id')

    if (body.status === 'complete') {
        cv.setValue('raw_text', String(body.raw_text || ''))
        cv.setValue('ocr_status', 'complete')
        cv.setValue('ocr_error', '')
    } else if (body.status === 'failed') {
        cv.setValue('ocr_status', 'failed')
        cv.setValue('ocr_error', String(body.error || 'Provider reported failure').substring(0, 1000))
    } else {
        return respondError(response, 400, "status must be 'complete' or 'failed'")
    }

    // The update() triggers onOcrStatusChange in
    // src/server/business-rules/cv-document.js, which builds the profile and
    // scores the application — this handler stays a thin, dumb receiver.
    cv.update()

    response.setStatus(200)
    response.setBody({ accepted: true, cv_document_id: body.cv_document_id })
}

function respondError(response, status, message) {
    response.setStatus(status)
    response.setBody({ accepted: false, error: message })
}

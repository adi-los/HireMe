import { gs, GlideRecord } from '@servicenow/glide'
import { RESTMessageV2 } from '@servicenow/glide/sn_ws'
import { config } from './config.js'
import { writeAudit, ACTIONS } from './audit.js'

/**
 * Outbound OCR call (blueprint p.04/p.06 step 3), wrapping the `RestMessage`
 * defined in `src/fluent/integrations/ocr-service.now.ts`.
 *
 * Async by design: this fires the request and returns immediately. The
 * provider is expected to POST the result back to the webhook in
 * `src/fluent/integrations/ocr-webhook.now.ts`. Nothing here blocks waiting
 * for OCR to finish — that would tie up a transaction for however long a
 * third party takes to run text extraction on a scanned document.
 *
 * `sn_ws` is referenced by string name (`RESTMessageV2`) rather than an
 * import because it is a global available in scoped server scripts, not a
 * typed module export.
 */
export function requestOcrExtraction(cvDocumentId) {
    if (!config.ocrEnabled()) {
        gs.info('[HireMe] OCR disabled; skipping extraction request for ' + cvDocumentId)
        return false
    }

    const endpoint = config.ocrEndpoint()
    if (!endpoint) {
        gs.error('[HireMe] x_winu_hireme.ocr.endpoint is empty; cannot request OCR for ' + cvDocumentId)
        markFailed(cvDocumentId, 'OCR endpoint not configured')
        return false
    }

    const cv = new GlideRecord('x_winu_hireme_cv_document')
    if (!cv.get(cvDocumentId)) return false

    try {
        const request = new RESTMessageV2('HireMe OCR Service', 'extract')
        request.setStringParameterNoEscape('base_url', endpoint)
        request.setStringParameterNoEscape('callback_token', config.ocrCallbackToken())
        request.setStringParameterNoEscape(
            'payload',
            JSON.stringify({
                cv_document_id: cvDocumentId,
                file_name: cv.getValue('file_name'),
                mime_type: cv.getValue('mime_type'),
            })
        )

        const response = request.execute()
        const status = response.getStatusCode()

        if (status >= 200 && status < 300) {
            cv.setValue('ocr_status', 'in_progress')
            cv.update()
            return true
        }

        markFailed(cvDocumentId, 'OCR provider returned HTTP ' + status)
        return false
    } catch (err) {
        markFailed(cvDocumentId, 'OCR request threw: ' + err)
        return false
    }
}

function markFailed(cvDocumentId, reason) {
    const cv = new GlideRecord('x_winu_hireme_cv_document')
    if (!cv.get(cvDocumentId)) return
    cv.setValue('ocr_status', 'failed')
    cv.setValue('ocr_error', String(reason).substring(0, 1000))
    cv.update()

    writeAudit({
        action: ACTIONS.OCR_FAILED,
        application: cv.getValue('application_ref'),
        actorType: 'system',
        reason: reason,
        details: { cv_document: cvDocumentId },
    })
}

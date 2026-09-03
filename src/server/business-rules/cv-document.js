import { gs } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'
import { config } from '../glide/config.js'
import { buildProfileFromCv, scoreApplication } from '../glide/pipeline.js'

/**
 * After insert on CVDocument — kick off OCR (p.06 step 3).
 *
 * This only queues the request; the actual outbound call lives in
 * `src/server/glide/ocr.js` and is invoked from the flow layer / a scheduled
 * retry, not synchronously here. A business rule that makes an outbound HTTP
 * call inline blocks the insert transaction on a third party's response time
 * — never do that.
 */
export function requestOcrOnInsert(current) {
    const cvDocumentId = current.getUniqueValue()

    if (!config.ocrEnabled()) {
        gs.info('[HireMe] OCR disabled (x_winu_hireme.ocr.enabled=false); CV ' + cvDocumentId + ' left pending')
        return
    }

    writeAudit({
        action: ACTIONS.OCR_REQUESTED,
        application: current.getValue('application_ref'),
        actorType: 'system',
        reason: 'CV uploaded, OCR requested',
        details: { cv_document: cvDocumentId, file_name: current.getValue('file_name') },
    })

    // current.ocr_status already defaults to 'pending' via the dictionary;
    // the actual HTTP call is triggered by the flow, which owns retry/backoff.
}

/**
 * After update on CVDocument — once OCR completes, build the CandidateProfile.
 * Runs whenever ocr_status transitions into 'complete'.
 */
export function onOcrStatusChange(current, previous) {
    const status = current.getValue('ocr_status')
    const priorStatus = previous ? previous.getValue('ocr_status') : ''
    if (status === priorStatus) return

    const applicationId = current.getValue('application_ref')

    if (status === 'complete') {
        writeAudit({
            action: ACTIONS.OCR_COMPLETED,
            application: applicationId,
            actorType: 'system',
            reason: 'OCR extraction completed',
            details: { cv_document: current.getUniqueValue(), text_length: (current.getValue('raw_text') || '').length },
        })
        // Building the profile from parsed text is pure JS + GlideRecord reads/
        // writes — safe to run inline here, unlike the outbound OCR call itself.
        const cvDocumentId = current.getUniqueValue()
        buildProfileFromCv(cvDocumentId)
        scoreApplication(applicationId)
    } else if (status === 'failed') {
        writeAudit({
            action: ACTIONS.OCR_FAILED,
            application: applicationId,
            actorType: 'system',
            reason: current.getValue('ocr_error') || 'OCR extraction failed',
            details: { cv_document: current.getUniqueValue() },
        })
    }
}

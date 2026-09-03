import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'
import { config } from '../glide/config.js'

/**
 * Retention & anonymization (blueprint p.11):
 * "24-month retention post-decision, then auto-anonymized."
 *
 * Runs daily. Finds Applications decided more than N months ago (N from
 * `x_winu_hireme.retention.months`, default 24) that have not already been
 * anonymized, and scrubs the Candidate PII while leaving everything else —
 * scores, audit trail, structure — intact. AuditLog is never touched: the
 * fact that a decision happened must survive even after the person's PII is
 * gone.
 *
 * Idempotent: a Candidate whose full_name is already the anonymized marker
 * is skipped, so re-running the job is safe.
 */

const ANONYMIZED_MARKER = '[ANONYMIZED]'

export function runRetentionAnonymization() {
    const months = config.retentionMonths()
    const cutoff = new GlideDateTime()
    cutoff.addMonths(-months)

    const apps = new GlideRecord('x_winu_hireme_application')
    apps.addNotNullQuery('final_decision')
    apps.addQuery('sys_updated_on', '<', cutoff)
    apps.query()

    let processed = 0
    while (apps.next()) {
        if (anonymizeApplication(apps)) processed++
    }

    gs.info('[HireMe] retention job: anonymized ' + processed + ' application(s) decided before ' + cutoff.getDisplayValue())
    return processed
}

function anonymizeApplication(app) {
    const applicationId = app.getUniqueValue()
    const candidate = new GlideRecord('x_winu_hireme_candidate')
    if (!candidate.get(app.getValue('candidate_ref'))) return false
    if (candidate.getValue('full_name') === ANONYMIZED_MARKER) return false // already done

    const before = {
        full_name: candidate.getValue('full_name'),
        email: candidate.getValue('email'),
        phone: candidate.getValue('phone'),
    }

    candidate.setValue('full_name', ANONYMIZED_MARKER)
    candidate.setValue('email', 'anonymized+' + candidate.getUniqueValue() + '@invalid.local')
    candidate.setValue('phone', '')
    candidate.update()

    // CV binaries carry PII too (a photo, a signature) — remove the attachment,
    // not just the extracted text, per p.11's "anonymized" promise.
    deleteCvAttachments(applicationId)

    writeAudit({
        action: ACTIONS.RETENTION_ANONYMIZED,
        application: applicationId,
        actorType: 'system',
        reason: 'Retention period elapsed (' + config.retentionMonths() + ' months since decision)',
        // Never log the PII itself into the audit trail — only that it existed.
        details: { fields_cleared: Object.keys(before), had_email: !!before.email, had_phone: !!before.phone },
    })
    return true
}

function deleteCvAttachments(applicationId) {
    const cv = new GlideRecord('x_winu_hireme_cv_document')
    cv.addQuery('application_ref', applicationId)
    cv.query()
    while (cv.next()) {
        const att = new GlideRecord('sys_attachment')
        att.addQuery('table_name', 'x_winu_hireme_cv_document')
        att.addQuery('table_sys_id', cv.getUniqueValue())
        att.query()
        while (att.next()) att.deleteRecord()

        cv.setValue('raw_text', '')
        cv.update()
    }
}

/**
 * On-request deletion (p.11: "candidates can request deletion at any time,
 * logged in AuditLog"). Distinct from the scheduled job: this runs
 * immediately, on an explicit request, for one application.
 */
export function anonymizeOnRequest(applicationId, reason) {
    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) return false

    const ok = anonymizeApplication(app)
    if (ok) {
        writeAudit({
            action: ACTIONS.RETENTION_ANONYMIZED,
            application: applicationId,
            actorType: 'user',
            reason: 'Candidate-requested deletion: ' + (reason || 'no reason given'),
            details: { requested: true },
        })
    }
    return ok
}

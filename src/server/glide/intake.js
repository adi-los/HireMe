import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { writeAudit, ACTIONS } from './audit.js'

/**
 * Candidate-facing intake (blueprint p.13: "Short form + drag-and-drop CV
 * upload + explicit consent checkbox").
 *
 * The public applicant is not assumed to be a `sys_user` (open-questions.md
 * #2) — no ACL here checks role membership. The record itself is the
 * credential: `access_token` is a GUID issued at apply time and required on
 * every subsequent read. That is the actual security boundary, enforced in
 * script, not by the ACL (which is deliberately permissive — see the ACL
 * definition in ocr-webhook-style two-layer comments in
 * fluent/integrations/candidate-portal.now.ts).
 *
 * File upload itself is NOT handled here. This creates an empty CVDocument
 * row and returns its sys_id; the caller (UI Builder apply flow) then
 * multipart-uploads the file to the platform Attachment API against that
 * row. Keeping upload on the platform's own attachment endpoint avoids
 * reimplementing multipart handling in a scripted REST route.
 */

function generateToken() {
    return gs.generateGUID().replace(/-/g, '')
}

/**
 * Reuse an existing Candidate by email, or create one.
 * A returning applicant should not fragment into duplicate Candidate rows.
 */
function findOrCreateCandidate(input) {
    const email = String(input.email || '').trim().toLowerCase()
    if (!email) return { error: 'email is required' }

    const existing = new GlideRecord('x_winu_hireme_candidate')
    existing.addQuery('email', email)
    existing.setLimit(1)
    existing.query()

    if (existing.next()) {
        // Returning candidate: touch nothing but consent, and only to fill it
        // in the first time. The guest session this runs under only has an
        // ACL for that one field (see acls.now.ts) — it deliberately cannot
        // overwrite full_name/phone/source on somebody else's existing row.
        const hadConsent = !!existing.getValue('consent_given_at')
        if (input.consent === true && !hadConsent) {
            existing.setValue('consent_given_at', new GlideDateTime().getValue())
            existing.update()
        }
        return { id: existing.getUniqueValue(), hadConsent: hadConsent || input.consent === true }
    }

    const candidate = new GlideRecord('x_winu_hireme_candidate')
    candidate.initialize()
    candidate.setValue('email', email)
    candidate.setValue('full_name', String(input.full_name || '').substring(0, 100))
    candidate.setValue('phone', String(input.phone || '').substring(0, 40))
    candidate.setValue('source', input.source || 'portal')
    if (input.consent === true) {
        candidate.setValue('consent_given_at', new GlideDateTime().getValue())
    }
    const id = candidate.insert()
    return { id: id, hadConsent: input.consent === true }
}

/**
 * Create an Application (+ an empty CVDocument placeholder) for a job offer.
 *
 * @param {Object} input { email, full_name, phone, source, consent, job_offer_id }
 * @returns {{applicationId, accessToken, cvDocumentId}|{error}}
 */
export function submitApplication(input) {
    const in_ = input || {}
    if (!in_.job_offer_id) return { error: 'job_offer_id is required' }
    if (in_.consent !== true) return { error: 'consent is required to apply' }

    const offer = new GlideRecord('x_winu_hireme_job_offer')
    if (!offer.get(in_.job_offer_id) || offer.getValue('status') !== 'open') {
        return { error: 'job offer is not open for applications' }
    }

    const candidateResult = findOrCreateCandidate(in_)
    if (candidateResult.error) return candidateResult

    const token = generateToken()
    const app = new GlideRecord('x_winu_hireme_application')
    app.initialize()
    app.setValue('candidate_ref', candidateResult.id)
    app.setValue('joboffer_ref', in_.job_offer_id)
    app.setValue('access_token', token)
    const applicationId = app.insert()

    // Empty placeholder — the UI attaches the actual file to this row via
    // the platform Attachment API, then flips ocr_status to kick off OCR
    // (or the attachment-uploaded business rule does, once written).
    const cv = new GlideRecord('x_winu_hireme_cv_document')
    cv.initialize()
    cv.setValue('application_ref', applicationId)
    cv.setValue('file_name', String(in_.file_name || '').substring(0, 255))
    cv.setValue('mime_type', String(in_.mime_type || '').substring(0, 100))
    const cvDocumentId = cv.insert()

    writeAudit({
        action: ACTIONS.APPLICATION_CREATED,
        application: applicationId,
        actorType: 'user',
        reason: 'Application submitted via public portal',
        details: { candidate_had_prior_consent: candidateResult.hadConsent, job_offer: in_.job_offer_id },
    })

    return { applicationId: applicationId, accessToken: token, cvDocumentId: cvDocumentId }
}

/**
 * "I'm Interested" soft-apply (p.13) — captures interest without a full
 * application. No CV, no CVDocument, just the candidate record and consent.
 */
export function registerInterest(input) {
    const in_ = input || {}
    if (in_.consent !== true) return { error: 'consent is required' }
    const candidateResult = findOrCreateCandidate(in_)
    if (candidateResult.error) return candidateResult

    writeAudit({
        action: ACTIONS.CONSENT_RECORDED,
        actorType: 'user',
        reason: "Soft-apply 'I'm interested' registered",
        details: { candidate: candidateResult.id },
    })
    return { candidateId: candidateResult.id }
}

/**
 * Status timeline for "My Applications" (p.13), gated by the access token
 * rather than a login. Deliberately returns NOTHING about the score or
 * category — candidates never see scores (blueprint p.11).
 */
export function getApplicationStatus(applicationId, accessToken) {
    if (!applicationId || !accessToken) return { error: 'applicationId and accessToken are required' }

    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) return { error: 'not found' }
    if (app.getValue('access_token') !== accessToken) return { error: 'not found' } // same message as missing, on purpose

    const offer = new GlideRecord('x_winu_hireme_job_offer')
    offer.get(app.getValue('joboffer_ref'))

    return {
        status: app.getValue('status'),
        applied_date: app.getValue('applied_date'),
        job_title: offer.isValidRecord() ? offer.getValue('title') : null,
        final_decision: app.getValue('final_decision') || null,
    }
}

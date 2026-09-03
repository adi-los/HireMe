import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'

/**
 * After insert on Application — record intake and the consent that permitted it.
 */
export function auditApplicationCreated(current) {
    const applicationId = current.getUniqueValue()

    writeAudit({
        action: ACTIONS.APPLICATION_CREATED,
        application: applicationId,
        actorType: 'user',
        reason: 'Application submitted',
        details: {
            candidate: current.getValue('candidate_ref'),
            job_offer: current.getValue('joboffer_ref'),
        },
    })

    // Consent is a GDPR-relevant fact (p.11) and belongs in the audit trail as
    // its own event, not just as a column on Candidate.
    const candidate = new GlideRecord('x_winu_hireme_candidate')
    if (candidate.get(current.getValue('candidate_ref'))) {
        const consent = candidate.getValue('consent_given_at')
        writeAudit({
            action: ACTIONS.CONSENT_RECORDED,
            application: applicationId,
            actorType: 'system',
            reason: consent ? 'Consent captured at ' + consent : 'MISSING CONSENT at time of application',
            details: { consent_given_at: consent || null, has_consent: !!consent },
        })
        if (!consent) {
            gs.warn('[HireMe] application ' + applicationId + ' created without candidate consent')
        }
    }
}

/**
 * After update on Application — audit the final decision.
 *
 * This is the most consequential event in the app: a human accepting or
 * rejecting a person. It records who, when and why, and it is the reason
 * AuditLog exists (p.06 step 9).
 */
export function auditApplicationDecision(current, previous) {
    const decision = current.getValue('final_decision')
    const before = previous ? previous.getValue('final_decision') : ''
    if (!decision || decision === before) return

    const applicationId = current.getUniqueValue()

    writeAudit({
        action: ACTIONS.DECISION_RECORDED,
        application: applicationId,
        actorType: 'user',
        reason: 'Final decision: ' + decision,
        details: {
            from: before || null,
            to: decision,
            status_at_decision: current.getValue('status'),
            decided_by: gs.getUserName(),
        },
    })

    // A decided application is closed out and queued for candidate notification.
    if (current.getValue('status') !== 'closed') {
        current.setValue('status', 'decided')
    }

    queueDecisionNotification(applicationId, decision)
}

/**
 * Queue the candidate notification (p.06 step 10).
 *
 * Deliberately only ever queued on an explicit human decision — there is no
 * path here that fires from a score. Blueprint p.09/p.11: nothing below
 * threshold is sent without RH sign-off.
 */
function queueDecisionNotification(applicationId, decision) {
    const note = new GlideRecord('x_winu_hireme_notification')
    note.initialize()
    note.setValue('application_ref', applicationId)
    note.setValue('channel', 'email')
    note.setValue('template', decision === 'accepted' ? 'decision_accepted' : 'decision_rejected')
    note.setValue('status', 'queued')
    note.setValue('sent_date', new GlideDateTime().getValue())
    note.insert()
}

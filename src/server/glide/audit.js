import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

/**
 * Append-only audit writer (blueprint p.11).
 *
 * Why this works even though the ACLs deny write to everyone: ACLs govern the
 * UI and REST, not server-side GlideRecord. So the platform can record history
 * here while no human — admin included — can edit or delete a row through the
 * interface. That asymmetry IS the guarantee; don't "fix" the ACLs.
 *
 * Every AI output and every human decision lands here with actor, timestamp
 * and reason.
 */

export const ACTIONS = {
    APPLICATION_CREATED: 'application.created',
    CONSENT_RECORDED: 'consent.recorded',
    OCR_REQUESTED: 'ocr.requested',
    OCR_COMPLETED: 'ocr.completed',
    OCR_FAILED: 'ocr.failed',
    PROFILE_PARSED: 'profile.parsed',
    SCORED: 'scoring.completed',
    RESCORED: 'scoring.rescored',
    CATEGORY_ASSIGNED: 'scoring.category_assigned',
    INTERVIEW_INVITED: 'interview.invited',
    INTERVIEW_COMPLETED: 'interview.completed',
    INTERVIEW_BLENDED: 'scoring.interview_blended',
    DECISION_RECORDED: 'decision.recorded',
    NOTIFICATION_SENT: 'notification.sent',
    COPILOT_QUERY: 'copilot.query',
    RETENTION_ANONYMIZED: 'retention.anonymized',
    CALL_SCHEDULED: 'call.scheduled',
    NOTE_ADDED: 'note.added',
}

/**
 * Write one audit row.
 *
 * @param {Object} entry
 * @param {string} entry.action        one of ACTIONS
 * @param {string} [entry.application] sys_id of the Application
 * @param {string} [entry.actorType]   'user' | 'ai' | 'system'
 * @param {string} [entry.actor]       sys_id; defaults to the session user
 * @param {string} [entry.reason]      human-readable justification
 * @param {Object} [entry.details]     structured before/after or payload
 * @returns {string|null} sys_id of the new row
 */
export function writeAudit(entry) {
    const e = entry || {}
    if (!e.action) {
        gs.error('[HireMe] writeAudit called without an action; refusing to write a meaningless row')
        return null
    }

    try {
        const log = new GlideRecord('x_winu_hireme_audit_log')
        log.initialize()
        log.setValue('action', e.action)
        log.setValue('actor_type', e.actorType || 'user')

        // A system/AI action has no session user; leave actor empty rather than
        // attributing a machine decision to whoever happened to trigger it.
        if (e.actor) {
            log.setValue('actor', e.actor)
        } else if (!e.actorType || e.actorType === 'user') {
            log.setValue('actor', gs.getUserID())
        }

        if (e.application) log.setValue('application_ref', e.application)
        if (e.reason) log.setValue('reason', String(e.reason).substring(0, 1000))
        if (e.details) {
            try {
                log.setValue('details', JSON.stringify(e.details))
            } catch (jsonErr) {
                log.setValue('details', JSON.stringify({ serialization_error: String(jsonErr) }))
            }
        }
        log.setValue('timestamp', new GlideDateTime().getValue())
        return log.insert()
    } catch (err) {
        // Auditing must never break the business operation it is recording.
        gs.error('[HireMe] failed to write audit row for ' + e.action + ': ' + err)
        return null
    }
}

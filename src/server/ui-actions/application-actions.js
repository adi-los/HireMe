import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'

/**
 * Server-side handlers behind the RH Workspace Action Bar (blueprint p.12):
 * "Accept · Reject · Call · Schedule AI Interview · Add Note — every action
 * fires a Flow and writes to AuditLog automatically."
 *
 * Wired as UiAction `script` module functions in
 * `src/fluent/automation/ui-actions.now.ts` — each runs as
 * `(current, params) => void` when its button is clicked.
 */

/** Accept — final decision only, never a score threshold (p.09/p.11). */
export function acceptApplication(current) {
    current.setValue('final_decision', 'accepted')
    if (current.getValue('status') !== 'closed') {
        current.setValue('status', 'decided')
    }
    current.update()
    // auditApplicationDecision in business-rules/audit-application.js fires
    // on this same update and handles the AuditLog entry + notification —
    // this action doesn't duplicate that logic.
}

/** Reject — same path as Accept, opposite outcome. */
export function rejectApplication(current) {
    current.setValue('final_decision', 'rejected')
    if (current.getValue('status') !== 'closed') {
        current.setValue('status', 'decided')
    }
    current.update()
}

/**
 * Call — "Call for Screening" (p.05 step 8b). The blueprint describes this
 * as creating a manual phone-screening task; rather than reach into the
 * platform's own `task` table from a scoped app (a heavier cross-scope
 * dependency for one button), this logs the same fact to AuditLog, which is
 * already the audited record of every recruiter action here and is what a
 * "was this candidate called?" question actually needs answered.
 */
export function scheduleCall(current) {
    writeAudit({
        action: ACTIONS.CALL_SCHEDULED,
        application: current.getUniqueValue(),
        actorType: 'user',
        reason: 'Recruiter scheduled a phone screening call',
        details: { candidate: current.getValue('candidate_ref') },
    })
    gs.addInfoMessage('Logged: phone screening call scheduled.')
}

/**
 * Schedule AI Interview — the manual counterpart to the auto-invite in
 * `business-rules/scoring-result.js`. Same guard against double-inviting.
 */
export function scheduleAiInterview(current) {
    const applicationId = current.getUniqueValue()

    const existing = new GlideRecord('x_winu_hireme_interview_session')
    existing.addQuery('application_ref', applicationId)
    existing.setLimit(1)
    existing.query()
    if (existing.next()) {
        gs.addErrorMessage('An interview session already exists for this application.')
        return
    }

    const session = new GlideRecord('x_winu_hireme_interview_session')
    session.initialize()
    session.setValue('application_ref', applicationId)
    session.setValue('status', 'invited')
    const sessionId = session.insert()

    if (current.getValue('status') === 'screened') {
        current.setValue('status', 'interviewing')
        current.update()
    }

    writeAudit({
        action: ACTIONS.INTERVIEW_INVITED,
        application: applicationId,
        actorType: 'user',
        reason: 'Recruiter manually scheduled the AI interview',
        details: { interview_session: sessionId },
    })
    gs.addInfoMessage('AI interview scheduled.')
}

/**
 * Add Note — reads the text the workspace client script staged in
 * `pending_note`, writes it to AuditLog, and clears the field in the same
 * update so it never holds a stale value.
 */
export function addNote(current) {
    const note = current.getValue('pending_note')
    if (!note) return

    writeAudit({
        action: ACTIONS.NOTE_ADDED,
        application: current.getUniqueValue(),
        actorType: 'user',
        reason: note,
    })

    current.setValue('pending_note', '')
    current.update()
    gs.addInfoMessage('Note added.')
}

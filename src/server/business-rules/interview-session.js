import { GlideDateTime, GlideRecord } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'
import { applyInterviewScore } from '../glide/pipeline.js'

/**
 * After update on InterviewSession — react to status transitions
 * Invited → In Progress → Completed → Reviewed (p.14).
 */
export function onInterviewStatusChange(current, previous) {
    const status = current.getValue('status')
    const priorStatus = previous ? previous.getValue('status') : ''
    if (status === priorStatus) return

    const applicationId = current.getValue('application_ref')

    if (status === 'completed') {
        if (!current.getValue('completed_at')) {
            current.setValue('completed_at', new GlideDateTime().getValue())
            current.update()
        }
        writeAudit({
            action: ACTIONS.INTERVIEW_COMPLETED,
            application: applicationId,
            actorType: 'system',
            reason: 'AI interview completed',
            details: {
                interview_session: current.getUniqueValue(),
                ai_subscore: current.getValue('ai_subscore'),
                flags: current.getValue('flags'),
            },
        })

        // Blend into the score immediately so the queue reflects the interview
        // as soon as it's available. The recruiter still reviews the full
        // transcript before deciding (p.14) — this only updates the number.
        applyInterviewScore(current.getUniqueValue())

        // Application moves into interviewing → decided is a human action later.
        const app = new GlideRecord('x_winu_hireme_application')
        if (app.get(applicationId) && app.getValue('status') === 'screened') {
            app.setValue('status', 'interviewing')
            app.update()
        }
    }
}

/** Before update — stamp invited_at the first time status becomes 'invited'. */
export function stampInvitedAt(current, previous) {
    const status = current.getValue('status')
    const priorStatus = previous ? previous.getValue('status') : ''
    if (status === 'invited' && status !== priorStatus && !current.getValue('invited_at')) {
        current.setValue('invited_at', new GlideDateTime().getValue())
    }
}

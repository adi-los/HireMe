import { GlideRecord } from '@servicenow/glide'
import { writeAudit, ACTIONS } from '../glide/audit.js'
import { config } from '../glide/config.js'

/**
 * After insert on ScoringResult — category-assignment audit event, and the
 * ONE auto-trigger the blueprint explicitly allows: inviting a Top Match
 * candidate to the AI interview when the job offer opts in (p.14).
 *
 * This does not decide anything about the candidate — it only offers them an
 * extra conversation. It is not the auto-rejection the blueprint forbids
 * (p.09/p.11), which stays unimplemented by design. `config.autoRejectEnabled()`
 * exists only so that guarantee is auditable, never so it can be wired up here.
 */
export function onScoringResultInsert(current) {
    if (current.getValue('is_current') !== 'true') return

    const applicationId = current.getValue('application_ref')
    const category = current.getValue('category')

    writeAudit({
        action: ACTIONS.CATEGORY_ASSIGNED,
        application: applicationId,
        actorType: 'system',
        reason: 'Category assigned: ' + category,
        details: { score: current.getValue('score'), category: category },
    })

    if (category !== 'top_match' || !config.autoInviteTopMatch()) return

    const app = new GlideRecord('x_winu_hireme_application')
    if (!app.get(applicationId)) return

    const offer = new GlideRecord('x_winu_hireme_job_offer')
    if (!offer.get(app.getValue('joboffer_ref'))) return
    if (offer.getValue('auto_interview_enabled') !== 'true') return

    // Never invite twice.
    const existing = new GlideRecord('x_winu_hireme_interview_session')
    existing.addQuery('application_ref', applicationId)
    existing.setLimit(1)
    existing.query()
    if (existing.next()) return

    const session = new GlideRecord('x_winu_hireme_interview_session')
    session.initialize()
    session.setValue('application_ref', applicationId)
    session.setValue('status', 'invited')
    const sessionId = session.insert()

    writeAudit({
        action: ACTIONS.INTERVIEW_INVITED,
        application: applicationId,
        actorType: 'system',
        reason: 'Auto-invited: Top Match with auto_interview_enabled on the job offer',
        details: { interview_session: sessionId },
    })
}

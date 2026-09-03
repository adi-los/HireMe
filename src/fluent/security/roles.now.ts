import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

/**
 * The four roles from the governance matrix (blueprint p.11).
 * Role names must be prefixed with the application scope.
 *
 * NOTE: roles cannot be renamed after they are saved to an instance.
 */

export const candidateRole = Role({
    $id: Now.ID['role_candidate'],
    name: 'x_winu_hireme.candidate',
    // Applicant. Own application only; no scores, no other candidates.
    description: 'HireMe candidate. Can view and edit only their own application.',
})

export const recruiterRole = Role({
    $id: Now.ID['role_recruiter'],
    name: 'x_winu_hireme.recruiter',
    // Manages assigned requisitions, runs Copilot, records decisions.
    description: 'HireMe recruiter. Manages applications for assigned requisitions and records decisions.',
    // canvas_user is the platform's own baseline requirement for ANY UI
    // Builder workspace route — there is a standing `*` ux_route ACL on
    // every instance that requires it. Without this, a recruiter with only
    // the app-specific role gets a flat "Access Denied" on the RH Workspace
    // regardless of how the workspace's own ACL is written; admin only
    // ever worked because adminOverrides silently bypassed the check.
    // Confirmed by impersonating a role-only demo user, not assumed —
    // see the workspace ACL in fluent/workspace/workspace.now.ts for the
    // full story. Matches the SDK's own workspace-guide example, which
    // sets this on its example user role for the same reason.
    containsRoles: ['canvas_user'],
})

export const hiringManagerRole = Role({
    $id: Now.ID['role_hiring_manager'],
    name: 'x_winu_hireme.hiring_manager',
    // Read-only on shortlisted candidates. May comment, may NOT decide.
    description: 'HireMe hiring manager. Read-only on shortlisted candidates; may comment, not decide.',
    // See recruiterRole above — same platform-baseline requirement.
    containsRoles: ['canvas_user'],
})

export const adminRole = Role({
    $id: Now.ID['role_admin'],
    name: 'x_winu_hireme.admin',
    // Configures scoring weights, categories, ACLs and AI Agent prompts.
    description: 'HireMe administrator. Configures scoring weights, categories, ACLs and AI Agent prompts.',
    // canvas_user would also arrive transitively via recruiterRole/
    // hiringManagerRole containment, but listed directly too so this
    // role's workspace access never depends on multi-level containment
    // resolving the way we expect.
    containsRoles: [recruiterRole, hiringManagerRole, 'canvas_user'],
})

/**
 * Machine identity for the OCR provider's callback, not named in the
 * blueprint's governance table (p.11) because that table is about people.
 * Kept separate from `admin` deliberately — least privilege for a service
 * account that only needs to post extracted text back to one endpoint.
 */
export const integrationRole = Role({
    $id: Now.ID['role_integration'],
    name: 'x_winu_hireme.integration',
    description: 'Service-account role for external callbacks (OCR webhook). Not for human users.',
})

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
})

export const hiringManagerRole = Role({
    $id: Now.ID['role_hiring_manager'],
    name: 'x_winu_hireme.hiring_manager',
    // Read-only on shortlisted candidates. May comment, may NOT decide.
    description: 'HireMe hiring manager. Read-only on shortlisted candidates; may comment, not decide.',
})

export const adminRole = Role({
    $id: Now.ID['role_admin'],
    name: 'x_winu_hireme.admin',
    // Configures scoring weights, categories, ACLs and AI Agent prompts.
    description: 'HireMe administrator. Configures scoring weights, categories, ACLs and AI Agent prompts.',
    containsRoles: [recruiterRole, hiringManagerRole],
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

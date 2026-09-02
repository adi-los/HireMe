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

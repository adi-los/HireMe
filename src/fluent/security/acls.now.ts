import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { candidateRole, recruiterRole, hiringManagerRole, adminRole } from './roles.now'

/**
 * Access controls implementing the governance matrix (blueprint p.11).
 *
 * Evaluation reminder: within one ACL, roles AND condition AND script must
 * ALL pass ("the Trinity"). Deny-unless ACLs run before allow-if ACLs.
 *
 * OPEN QUESTION (docs/open-questions.md #2): the candidate-ownership script
 * below matches on email because Candidate has no sys_user reference — public
 * portal applicants may not be platform users. Decide the identity model
 * before relying on these candidate ACLs in production.
 */

/* ------------------------------------------------------------------ *
 * Application
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_application_read_recruiter'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'read',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Recruiters and admins read applications.',
})

Acl({
    $id: Now.ID['acl_application_read_manager'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'read',
    roles: [hiringManagerRole],
    adminOverrides: true,
    // Hiring managers only see candidates that reached screening or beyond.
    condition: 'statusINscreened,interviewing,decided',
    description: 'Hiring managers read shortlisted applications only.',
})

Acl({
    $id: Now.ID['acl_application_read_candidate'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'read',
    roles: [candidateRole],
    adminOverrides: true,
    script: `
        var ownEmail = gs.getUser().getEmail();
        answer = (ownEmail && current.candidate_ref.email == ownEmail);
    `,
    description: 'Candidates read only their own application.',
})

Acl({
    $id: Now.ID['acl_application_write_recruiter'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'write',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Only recruiters and admins modify applications.',
})

/**
 * The decision field is the single most sensitive write in the app.
 * Hiring managers are deliberately excluded: "comment, not decide" (p.11).
 */
Acl({
    $id: Now.ID['acl_application_final_decision_write'],
    type: 'record',
    table: 'x_winu_hireme_application',
    field: 'final_decision',
    operation: 'write',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Final Accept/Reject is a human recruiter decision only.',
})

/* ------------------------------------------------------------------ *
 * ScoringResult — candidates must never see their score (p.11).
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_scoring_read'],
    type: 'record',
    table: 'x_winu_hireme_scoring_result',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Scores are internal. Candidate role is intentionally absent.',
})

/**
 * Scores are written by the scoring flow running as the app user, never by a
 * recruiter hand-editing a number. Admin-only keeps the audit trail honest.
 */
Acl({
    $id: Now.ID['acl_scoring_write'],
    type: 'record',
    table: 'x_winu_hireme_scoring_result',
    operation: 'write',
    roles: [adminRole],
    adminOverrides: true,
    description: 'Scores are system-generated; no manual override by recruiters.',
})

/* ------------------------------------------------------------------ *
 * InterviewSession
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_interview_read'],
    type: 'record',
    table: 'x_winu_hireme_interview_session',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Recruiters review the full transcript before deciding.',
})

/* ------------------------------------------------------------------ *
 * AuditLog — append-only, read-restricted.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_audit_read'],
    type: 'record',
    table: 'x_winu_hireme_audit_log',
    operation: 'read',
    roles: [adminRole],
    adminOverrides: true,
    description: 'Audit trail is admin-visible only.',
})

/**
 * No role may edit or delete audit rows. These ACLs grant nothing to nobody
 * on purpose — with adminOverrides false, even admin cannot tamper via UI.
 */
Acl({
    $id: Now.ID['acl_audit_write_denied'],
    type: 'record',
    table: 'x_winu_hireme_audit_log',
    operation: 'write',
    adminOverrides: false,
    script: `answer = false;`,
    description: 'Audit log is append-only. Never writable from the UI.',
})

Acl({
    $id: Now.ID['acl_audit_delete_denied'],
    type: 'record',
    table: 'x_winu_hireme_audit_log',
    operation: 'delete',
    adminOverrides: false,
    script: `answer = false;`,
    description: 'Audit log rows are never deleted.',
})

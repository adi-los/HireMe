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

/* ------------------------------------------------------------------ *
 * Candidate — PII. Internal roles see everyone; a candidate sees only
 * their own record, by the same email-match placeholder as Application
 * (open-questions.md #2). Write is internal-only: the apply flow that
 * creates/updates a Candidate runs as the app's service context, not as
 * the public portal visitor directly, so a client-side candidate role
 * does not need table write access for the intake flow to work.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_candidate_read_internal'],
    type: 'record',
    table: 'x_winu_hireme_candidate',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Recruiters, hiring managers and admins see all candidates.',
})

Acl({
    $id: Now.ID['acl_candidate_read_own'],
    type: 'record',
    table: 'x_winu_hireme_candidate',
    operation: 'read',
    roles: [candidateRole],
    adminOverrides: true,
    script: `
        var ownEmail = gs.getUser().getEmail();
        answer = (ownEmail && current.email == ownEmail);
    `,
    description: 'Candidates read only their own record.',
})

Acl({
    $id: Now.ID['acl_candidate_write_internal'],
    type: 'record',
    table: 'x_winu_hireme_candidate',
    operation: 'write',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Candidate records are corrected by recruiters/admins, or by the apply flow acting server-side.',
})

/* ------------------------------------------------------------------ *
 * JobOffer — the one table with a real public-read requirement (p.13:
 * "Browse and search open JobOffers ... no login required to browse").
 *
 * `condition` with no `roles` and no `securityAttribute` is the documented
 * pattern for genuinely public/guest-readable access (same construct the
 * SDK's own building-ai-agents-guide names for a "Public" ACL access
 * answer). Whatever page renders the job board still needs
 * `allowWebServiceAccess`/an unauthenticated-capable surface to reach it —
 * that is UI-layer wiring, not an ACL concern — but this ACL itself already
 * grants the guest session read access once that surface exists.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_joboffer_read_open'],
    type: 'record',
    table: 'x_winu_hireme_job_offer',
    operation: 'read',
    condition: 'status=open',
    adminOverrides: true,
    description: 'Open job offers are publicly readable, including by an unauthenticated guest session.',
})

Acl({
    $id: Now.ID['acl_joboffer_read_internal'],
    type: 'record',
    table: 'x_winu_hireme_job_offer',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Internal roles see draft/on-hold/closed offers too.',
})

Acl({
    $id: Now.ID['acl_joboffer_write'],
    type: 'record',
    table: 'x_winu_hireme_job_offer',
    operation: 'write',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Only recruiters/admins author job offers.',
})

/* ------------------------------------------------------------------ *
 * CVDocument — contains a full CV: PII plus whatever the person chose to
 * put in it. Internal-only read; write is system/flow only (the OCR
 * webhook and pipeline run server-side, past ACLs entirely).
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_cv_document_read'],
    type: 'record',
    table: 'x_winu_hireme_cv_document',
    operation: 'read',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'CV text is internal-only, even from hiring managers — logistics/PII surface kept minimal.',
})

Acl({
    $id: Now.ID['acl_cv_document_write'],
    type: 'record',
    table: 'x_winu_hireme_cv_document',
    operation: 'write',
    roles: [adminRole],
    adminOverrides: true,
    description: 'CV records are written by the intake/OCR pipeline, not edited by hand.',
})

/* ------------------------------------------------------------------ *
 * CandidateProfile — parsed structure. Same visibility as CV text.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_candidate_profile_read'],
    type: 'record',
    table: 'x_winu_hireme_candidate_profile',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Parsed profile is visible to anyone who can review the candidate.',
})

Acl({
    $id: Now.ID['acl_candidate_profile_write'],
    type: 'record',
    table: 'x_winu_hireme_candidate_profile',
    operation: 'write',
    roles: [adminRole],
    adminOverrides: true,
    description: 'Profiles are system-generated by the parser, not hand-edited.',
})

/* ------------------------------------------------------------------ *
 * ChatInteraction — Copilot / Virtual Agent transcript.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_chat_interaction_read'],
    type: 'record',
    table: 'x_winu_hireme_chat_interaction',
    operation: 'read',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Copilot transcripts are internal.',
})

Acl({
    $id: Now.ID['acl_chat_interaction_create'],
    type: 'record',
    table: 'x_winu_hireme_chat_interaction',
    operation: 'create',
    // The Copilot REST endpoint (src/server/rest/copilot.js) runs as the
    // invoking recruiter's own session, not an elevated service account, so
    // both the user turn and the assistant turn it inserts need a `create`
    // ACL for that recruiter's roles — there was none at all before this,
    // which would have silently 403'd every chat turn under impersonation.
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'Recruiters/hiring managers write their own Copilot turns; the assistant turn is inserted in the same session.',
})

Acl({
    $id: Now.ID['acl_chat_interaction_write'],
    type: 'record',
    table: 'x_winu_hireme_chat_interaction',
    operation: 'write',
    roles: [adminRole],
    adminOverrides: true,
    // Append-only like ScoringResult/AuditLog — a transcript row is
    // inserted once and never edited after the fact.
    description: 'Chat rows are appended once, never edited by hand.',
})

/* ------------------------------------------------------------------ *
 * Notification — outbound message log.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_notification_read'],
    type: 'record',
    table: 'x_winu_hireme_notification',
    operation: 'read',
    roles: [recruiterRole, adminRole],
    adminOverrides: true,
    description: 'Notification log is an ops/debugging surface for recruiters and admins.',
})

Acl({
    $id: Now.ID['acl_notification_write'],
    type: 'record',
    table: 'x_winu_hireme_notification',
    operation: 'write',
    roles: [adminRole],
    adminOverrides: true,
    description: 'Notifications are queued by business rules, not composed by hand.',
})

/* ------------------------------------------------------------------ *
 * KpiSnapshot — reporting table behind the dashboard (p.10). Admin-only:
 * recruiters get the dashboard widget, not the raw rows.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_kpi_snapshot_read'],
    type: 'record',
    table: 'x_winu_hireme_kpi_snapshot',
    operation: 'read',
    roles: [adminRole],
    adminOverrides: true,
    description: 'Raw KPI rows are an admin surface; the dashboard widget is how recruiters see this.',
})

Acl({
    $id: Now.ID['acl_kpi_snapshot_write'],
    type: 'record',
    table: 'x_winu_hireme_kpi_snapshot',
    operation: 'write',
    adminOverrides: false,
    script: `answer = false;`,
    description: 'KPI snapshots are written only by the hourly aggregation job (server-side, bypasses ACLs), never edited.',
})

/* ------------------------------------------------------------------ *
 * Public create — the anonymous portal apply flow (p.13).
 *
 * A request to `/api/x_winu_hireme/hireme_portal/apply` runs as the
 * platform's guest user, which holds no HireMe role. Scoped-app GlideRecord
 * calls enforce ACLs even from server-side script, so without these the
 * `candidate.insert()` / `app.insert()` / `cv.insert()` calls inside
 * `src/server/glide/intake.js` would fail silently under the guest session.
 *
 * Scoped narrowly to `create` only — `read`, `write` (update) and `delete`
 * on these tables keep the restrictions defined above. An anonymous caller
 * can originate a new Candidate/Application/CVDocument row and nothing else;
 * every other operation still requires a role or the access-token check.
 * ------------------------------------------------------------------ */

Acl({
    $id: Now.ID['acl_candidate_create_public'],
    type: 'record',
    table: 'x_winu_hireme_candidate',
    operation: 'create',
    script: `answer = true;`,
    description: 'Public portal apply flow creates the Candidate row. See the block comment above.',
})

Acl({
    $id: Now.ID['acl_application_create_public'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'create',
    script: `answer = true;`,
    description: 'Public portal apply flow creates the Application row. See the block comment above.',
})

/**
 * Public token-gated read — "My Applications" (p.13) status lookup for a
 * caller with no ServiceNow session.
 *
 * The condition only checks that `access_token` is populated, NOT that it
 * matches the caller's token — an ACL script has no access to the inbound
 * request's query parameters, only to `current`. The actual secret
 * comparison happens in `getApplicationStatus()`
 * (src/server/glide/intake.js): a caller must already supply the exact token
 * to get a useful response back. This ACL only makes the GlideRecord.get()
 * call succeed under the guest session in the first place.
 *
 * Scoped risk, accepted deliberately: any future guest-session GlideRecord
 * read of this table would also pass this condition. That is contained
 * today because `allowWebServiceAccess` is unset on x_winu_hireme_application
 * (Table API returns 403) and no public UI page queries this table yet — the
 * only reachable path is the status route, which enforces the real token
 * check. Revisit this ACL if either of those two facts changes.
 */
Acl({
    $id: Now.ID['acl_application_read_public_by_token'],
    type: 'record',
    table: 'x_winu_hireme_application',
    operation: 'read',
    condition: 'access_tokenISNOTEMPTY',
    description: 'Public: lets the token-gated status endpoint read an application under a guest session. See block comment above.',
})

Acl({
    $id: Now.ID['acl_cv_document_create_public'],
    type: 'record',
    table: 'x_winu_hireme_cv_document',
    operation: 'create',
    script: `answer = true;`,
    description: 'Public portal apply flow creates the empty CVDocument placeholder. See the block comment above.',
})

/**
 * Narrow exception for a RETURNING candidate: the guest session may stamp
 * consent_given_at on their own existing row (matched by email in
 * src/server/glide/intake.js), and nothing else on that table. The table-wide
 * `write` ACL above stays recruiter/admin-only — a guest still cannot touch
 * full_name, phone, or any other field on someone else's Candidate record.
 */
Acl({
    $id: Now.ID['acl_candidate_consent_write_public'],
    type: 'record',
    table: 'x_winu_hireme_candidate',
    field: 'consent_given_at',
    operation: 'write',
    script: `answer = true;`,
    description: 'Public: lets a returning candidate record consent on re-apply. See block comment above.',
})

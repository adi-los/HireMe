import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn, MultiLineTextColumn } from '@servicenow/sdk/core'

/**
 * Application — the spine of the model. Every supporting table
 * (CV, profile, score, interview, chat, notification, audit) hangs off this.
 *
 * DECISION (open, see docs/open-questions.md #1): this is a standalone table,
 * matching the blueprint data model exactly. If you want SLA timers,
 * assignment and work notes for free, switch to `extends: 'task'` — do it
 * BEFORE the first deploy, because changing a table's parent afterwards is
 * not a supported in-place migration.
 */
export const x_winu_hireme_application = Table({
    name: 'x_winu_hireme_application',
    label: 'Application',
    display: 'number',
    audit: true,
    autoNumber: { number: 1000, numberOfDigits: 7, prefix: 'HIRE' },
    schema: {
        number: StringColumn({ label: 'Number', maxLength: 40, readOnly: true }),
        candidate_ref: ReferenceColumn({
            label: 'Candidate',
            referenceTable: 'x_winu_hireme_candidate',
            mandatory: true,
            cascadeRule: 'cascade',
        }),
        joboffer_ref: ReferenceColumn({
            label: 'Job Offer',
            referenceTable: 'x_winu_hireme_job_offer',
            mandatory: true,
            cascadeRule: 'restrict',
        }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            default: 'received',
            choices: {
                received: 'Received',
                screened: 'Screened',
                interviewing: 'Interviewing',
                decided: 'Decided',
                closed: 'Closed',
            },
        }),
        applied_date: DateTimeColumn({ label: 'Applied Date' }),
        // Recruiter who owns this application. Drives the "their assigned
        // requisitions" ACL condition (blueprint p.11).
        assigned_recruiter: ReferenceColumn({
            label: 'Assigned Recruiter',
            referenceTable: 'sys_user',
            cascadeRule: 'none',
        }),
        // Set by RH only — never by an AI agent. Enforced by ACL.
        final_decision: StringColumn({
            label: 'Final Decision',
            maxLength: 40,
            choices: {
                accepted: 'Accepted',
                rejected: 'Rejected',
                withdrawn: 'Withdrawn',
            },
        }),
        // Working answer to open-questions.md #2: the public portal candidate
        // is not necessarily a sys_user, so this opaque token — issued at
        // apply time, required on every status check — is what "My
        // Applications" (p.13) authenticates with instead of a login. Revisit
        // if/when the identity model changes to real candidate accounts.
        access_token: StringColumn({ label: 'Access Token', maxLength: 64 }),
        // Transient carrier for the "Add Note" action bar button (p.12): the
        // workspace client script stages text here and submits, the
        // add-note UI action reads it into AuditLog and clears it in the
        // same server round trip. Never holds a value outside that window —
        // it is not a durable notes field.
        pending_note: MultiLineTextColumn({ label: 'Pending Note (internal)' }),
    },
})

import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn, JsonColumn } from '@servicenow/sdk/core'

/**
 * AuditLog — append-only. Every decision, every AI output, every consent
 * change. No role gets write or delete on this table (blueprint p.11);
 * rows are inserted server-side only.
 */
export const x_winu_hireme_audit_log = Table({
    name: 'x_winu_hireme_audit_log',
    label: 'Audit Log',
    audit: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            // Deliberately NOT cascade: the audit trail outlives the record.
            cascadeRule: 'none',
        }),
        actor: ReferenceColumn({
            label: 'Actor',
            referenceTable: 'sys_user',
            cascadeRule: 'none',
        }),
        actor_type: StringColumn({
            label: 'Actor Type',
            maxLength: 20,
            default: 'user',
            choices: { user: 'User', ai: 'AI Agent', system: 'System' },
        }),
        action: StringColumn({ label: 'Action', maxLength: 100 }),
        reason: StringColumn({ label: 'Reason', maxLength: 1000 }),
        // Before/after snapshot where relevant.
        details: JsonColumn({ label: 'Details' }),
        timestamp: DateTimeColumn({ label: 'Timestamp' }),
    },
})

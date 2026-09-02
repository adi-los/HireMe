import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, MultiLineTextColumn, DateTimeColumn, JsonColumn } from '@servicenow/sdk/core'

/**
 * ChatInteraction — every Copilot / Virtual Agent turn, stored so that
 * "what did the AI tell the recruiter?" stays answerable months later.
 */
export const x_winu_hireme_chat_interaction = Table({
    name: 'x_winu_hireme_chat_interaction',
    label: 'Chat Interaction',
    audit: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            cascadeRule: 'cascade',
        }),
        actor: ReferenceColumn({
            label: 'Actor',
            referenceTable: 'sys_user',
            cascadeRule: 'none',
        }),
        role: StringColumn({
            label: 'Role',
            maxLength: 20,
            choices: { user: 'User', assistant: 'Assistant' },
        }),
        channel: StringColumn({
            label: 'Channel',
            maxLength: 40,
            choices: {
                rh_copilot: 'RH Copilot',
                candidate_va: 'Candidate Virtual Agent',
            },
        }),
        message: MultiLineTextColumn({ label: 'Message' }),
        // Fields/records the answer was grounded in — backs the "answers cite
        // the source field" promise on blueprint p.12.
        citations: JsonColumn({ label: 'Citations' }),
        timestamp: DateTimeColumn({ label: 'Timestamp' }),
    },
})

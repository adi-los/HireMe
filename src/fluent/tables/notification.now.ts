import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

/**
 * Notification — outbound message log (email / portal / push / Slack / Teams).
 */
export const x_winu_hireme_notification = Table({
    name: 'x_winu_hireme_notification',
    label: 'Notification',
    audit: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            cascadeRule: 'cascade',
        }),
        channel: StringColumn({
            label: 'Channel',
            maxLength: 40,
            choices: {
                email: 'Email',
                portal: 'Portal',
                push: 'Push',
                slack: 'Slack',
                teams: 'Teams',
            },
        }),
        template: StringColumn({ label: 'Template', maxLength: 100 }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            default: 'queued',
            choices: {
                queued: 'Queued',
                sent: 'Sent',
                failed: 'Failed',
            },
        }),
        sent_date: DateTimeColumn({ label: 'Sent Date' }),
        error: StringColumn({ label: 'Error', maxLength: 1000 }),
    },
})

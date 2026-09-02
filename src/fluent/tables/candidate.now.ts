import '@servicenow/sdk/global'
import { Table, StringColumn, EmailColumn, DateTimeColumn } from '@servicenow/sdk/core'

/**
 * Candidate — the person. One Candidate may have many Applications.
 * Blueprint p.07/p.08.
 */
export const x_winu_hireme_candidate = Table({
    name: 'x_winu_hireme_candidate',
    label: 'Candidate',
    display: 'full_name',
    audit: true,
    schema: {
        full_name: StringColumn({
            label: 'Full Name',
            maxLength: 100,
            mandatory: true,
        }),
        email: EmailColumn({ label: 'Email', mandatory: true }),
        phone: StringColumn({ label: 'Phone', maxLength: 40 }),
        source: StringColumn({
            label: 'Source',
            maxLength: 40,
            default: 'portal',
            choices: {
                portal: 'Portal',
                referral: 'Referral',
                agency: 'Agency',
                career_fair: 'Career Fair',
            },
        }),
        // GDPR-style consent. Required before an application may be submitted;
        // enforced by the intake flow, not by the dictionary, so that a
        // soft-apply ("I'm interested") record can exist without it.
        consent_given_at: DateTimeColumn({ label: 'Consent Date' }),
    },
})

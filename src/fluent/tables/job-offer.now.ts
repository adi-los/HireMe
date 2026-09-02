import '@servicenow/sdk/global'
import { Table, StringColumn, JsonColumn, BooleanColumn } from '@servicenow/sdk/core'

/**
 * JobOffer — the requisition a candidate applies against.
 * `requirements` holds the structured criteria the Scoring Agent reads.
 */
export const x_winu_hireme_job_offer = Table({
    name: 'x_winu_hireme_job_offer',
    label: 'Job Offer',
    display: 'title',
    audit: true,
    schema: {
        title: StringColumn({ label: 'Title', maxLength: 120, mandatory: true }),
        department: StringColumn({ label: 'Department', maxLength: 80 }),
        location: StringColumn({ label: 'Location', maxLength: 80 }),
        description: StringColumn({ label: 'Description', maxLength: 4000 }),
        // Structured criteria consumed by the scoring engine, e.g.
        // { "skills": [{"name":"kubernetes","weight":3}], "min_experience_years": 4 }
        requirements: JsonColumn({ label: 'Requirements' }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            default: 'draft',
            choices: {
                draft: 'Draft',
                open: 'Open',
                on_hold: 'On Hold',
                closed: 'Closed',
            },
        }),
        // Blueprint p.14: auto-trigger AI interview when Category = Top Match.
        auto_interview_enabled: BooleanColumn({ label: 'Auto Interview Enabled' }),
    },
})

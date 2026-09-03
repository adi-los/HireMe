import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, JsonColumn, IntegerColumn, DecimalColumn } from '@servicenow/sdk/core'

/**
 * CandidateProfile — normalized structure parsed out of the raw OCR text.
 * `data_confidence` (0-1) feeds the scoring penalty term (blueprint p.09).
 */
export const x_winu_hireme_candidate_profile = Table({
    name: 'x_winu_hireme_candidate_profile',
    label: 'Candidate Profile',
    audit: true,
    // See the matching comment on x_winu_hireme_application — the CV Viewer
    // UI Page reads this table via the Table API directly.
    allowWebServiceAccess: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            mandatory: true,
            cascadeRule: 'cascade',
        }),
        // ["kubernetes", "typescript", ...]
        skills: JsonColumn({ label: 'Skills' }),
        experience_years: IntegerColumn({ label: 'Experience Years' }),
        education: StringColumn({ label: 'Education', maxLength: 255 }),
        // [{ "title": "...", "company": "...", "from": "...", "to": "..." }]
        past_roles: JsonColumn({ label: 'Past Roles' }),
        // 0.00-1.00 — how much of the profile was parsed cleanly vs guessed.
        data_confidence: DecimalColumn({ label: 'Data Confidence' }),
        parser_version: StringColumn({ label: 'Parser Version', maxLength: 40 }),
    },
})

import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, JsonColumn, IntegerColumn, DateTimeColumn } from '@servicenow/sdk/core'

/**
 * ScoringResult — one row per scoring run. Never overwritten: a re-score
 * writes a NEW row so the audit trail keeps every model version's verdict
 * (blueprint p.11, "model version & prompt are logged per event").
 */
export const x_winu_hireme_scoring_result = Table({
    name: 'x_winu_hireme_scoring_result',
    label: 'Scoring Result',
    audit: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            mandatory: true,
            cascadeRule: 'cascade',
        }),
        score: IntegerColumn({ label: 'Score' }),
        category: StringColumn({
            label: 'Category',
            maxLength: 40,
            choices: {
                top_match: 'Top Match',
                strong_fit: 'Strong Fit',
                potential: 'Potential',
                not_a_fit: 'Not a Fit',
            },
        }),
        // Per-criterion sub-scores — the explainability payload the RH
        // workspace renders. Shape is documented in docs/scoring.md.
        breakdown_json: JsonColumn({ label: 'Breakdown' }),
        // Prompt + agent version used, for the fairness audit.
        model_version: StringColumn({ label: 'Model Version', maxLength: 60 }),
        scored_at: DateTimeColumn({ label: 'Scored At' }),
        // Marks the row that currently drives the queue; a blended
        // post-interview score supersedes the original (blueprint p.14).
        is_current: StringColumn({
            label: 'Is Current',
            maxLength: 10,
            default: 'true',
            choices: { true: 'Yes', false: 'No' },
        }),
    },
})

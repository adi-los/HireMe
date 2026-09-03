import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, DecimalColumn, DateTimeColumn, JsonColumn } from '@servicenow/sdk/core'

/**
 * KpiSnapshot — the reporting table behind the RH dashboard (blueprint p.10).
 *
 * "A scheduled Flow runs hourly, aggregating Application, ScoringResult and
 * InterviewSession records into a reporting table." Dashboards read this, never
 * the transactional tables, so a heavy dashboard can't slow down intake.
 *
 * One row per run per job offer (plus a global row where joboffer is empty).
 */
export const x_winu_hireme_kpi_snapshot = Table({
    name: 'x_winu_hireme_kpi_snapshot',
    label: 'KPI Snapshot',
    audit: false,
    schema: {
        captured_at: DateTimeColumn({ label: 'Captured At' }),
        // Empty = platform-wide totals.
        joboffer_ref: StringColumn({ label: 'Job Offer', maxLength: 32 }),
        scope: StringColumn({
            label: 'Scope',
            maxLength: 20,
            default: 'global',
            choices: { global: 'Global', joboffer: 'Job Offer' },
        }),

        applications_total: IntegerColumn({ label: 'Applications Total' }),
        applications_scored: IntegerColumn({ label: 'Applications Scored' }),
        applications_decided: IntegerColumn({ label: 'Applications Decided' }),

        // Blueprint p.10 headline metrics.
        avg_time_to_screen_hours: DecimalColumn({ label: 'Avg Time-to-Screen (h)' }),
        avg_time_to_hire_days: DecimalColumn({ label: 'Avg Time-to-Hire (d)' }),
        ocr_success_rate: DecimalColumn({ label: 'OCR Success Rate' }),
        sla_compliance_rate: DecimalColumn({ label: 'RH SLA Compliance' }),
        offer_conversion_rate: DecimalColumn({ label: 'Offer Conversion Rate' }),
        interview_completion_rate: DecimalColumn({ label: 'AI Interview Completion' }),

        // Fairness audit (p.10): variance of scores across cohorts. A rising
        // number is the early-warning signal for systemic bias.
        score_variance: DecimalColumn({ label: 'Score Variance' }),
        // Counts per category, e.g. { "top_match": 12, "strong_fit": 28, ... }
        category_distribution: JsonColumn({ label: 'Category Distribution' }),
    },
})

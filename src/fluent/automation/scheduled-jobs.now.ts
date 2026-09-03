import '@servicenow/sdk/global'
import { ScheduledScript } from '@servicenow/sdk/core'
import { runKpiAggregation } from '../../server/jobs/kpi-aggregation'
import { runRetentionAnonymization } from '../../server/jobs/retention'

/**
 * KPI aggregation — hourly (blueprint p.10).
 * "A scheduled Flow runs hourly, aggregating Application, ScoringResult and
 * InterviewSession records into a reporting table."
 */
export const kpiAggregationJob = ScheduledScript({
    $id: Now.ID['job_kpi_aggregation'],
    name: 'HireMe - KPI Aggregation',
    active: true,
    frequency: 'periodically',
    executionInterval: { hours: 1 },
    script: runKpiAggregation,
})

/**
 * Retention & anonymization — daily (blueprint p.11).
 * "24-month retention post-decision, then auto-anonymized."
 */
export const retentionJob = ScheduledScript({
    $id: Now.ID['job_retention_anonymization'],
    name: 'HireMe - Retention Anonymization',
    active: true,
    frequency: 'daily',
    executionTime: { hours: 3, minutes: 0, seconds: 0 },
    script: runRetentionAnonymization,
})

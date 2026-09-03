import { gs, GlideRecord, GlideAggregate, GlideDateTime } from '@servicenow/glide'
import { slaHoursFor } from '../scoring.js'

/**
 * Hourly KPI aggregation (blueprint p.10):
 * "A scheduled Flow runs hourly, aggregating Application, ScoringResult and
 * InterviewSession records into a reporting table."
 *
 * Writes one global KpiSnapshot row. Dashboards read this table, never the
 * live transactional tables, so a busy dashboard never competes with intake
 * for database load.
 */
export function runKpiAggregation() {
    const snapshot = {
        captured_at: new GlideDateTime().getValue(),
        scope: 'global',
        applications_total: countAll('x_winu_hireme_application'),
        applications_scored: countDistinctScored(),
        applications_decided: countWhere('x_winu_hireme_application', 'final_decisionISNOTEMPTY'),
        ocr_success_rate: ocrSuccessRate(),
        sla_compliance_rate: slaComplianceRate(),
        interview_completion_rate: interviewCompletionRate(),
        offer_conversion_rate: offerConversionRate(),
        score_variance: scoreVariance(),
        category_distribution: JSON.stringify(categoryDistribution()),
    }

    const row = new GlideRecord('x_winu_hireme_kpi_snapshot')
    row.initialize()
    for (const key in snapshot) row.setValue(key, snapshot[key])
    const id = row.insert()

    gs.info('[HireMe] KPI snapshot ' + id + ': ' + JSON.stringify(snapshot))
    return id
}

function countAll(table) {
    const ga = new GlideAggregate(table)
    ga.addAggregate('COUNT', 'sys_id')
    ga.query()
    return ga.next() ? parseInt(ga.getAggregate('COUNT', 'sys_id'), 10) || 0 : 0
}

function countWhere(table, encodedQuery) {
    const ga = new GlideAggregate(table)
    ga.addEncodedQuery(encodedQuery)
    ga.addAggregate('COUNT', 'sys_id')
    ga.query()
    return ga.next() ? parseInt(ga.getAggregate('COUNT', 'sys_id'), 10) || 0 : 0
}

function countDistinctScored() {
    const ga = new GlideAggregate('x_winu_hireme_scoring_result')
    ga.addQuery('is_current', 'true')
    ga.addAggregate('COUNT', 'sys_id')
    ga.query()
    return ga.next() ? parseInt(ga.getAggregate('COUNT', 'sys_id'), 10) || 0 : 0
}

/** Share of CV documents whose OCR pass completed rather than failed. */
function ocrSuccessRate() {
    const total = countWhere('x_winu_hireme_cv_document', 'ocr_statusINcomplete,failed')
    if (total === 0) return null
    const success = countWhere('x_winu_hireme_cv_document', 'ocr_status=complete')
    return round2(success / total)
}

/**
 * Share of current scoring results whose application was first reviewed
 * (moved past 'received') within that category's SLA (p.09/p.11).
 *
 * Approximated from sys_updated_on rather than a dedicated "first reviewed"
 * timestamp — good enough for a dashboard trend, not for a per-record
 * guarantee. A precise version would stamp a `first_reviewed_at` field.
 */
function slaComplianceRate() {
    const ga = new GlideAggregate('x_winu_hireme_scoring_result')
    ga.addQuery('is_current', 'true')
    ga.query()

    let total = 0
    let withinSla = 0
    while (ga.next()) {
        total++
        const category = ga.getValue('category')
        const slaHours = slaHoursFor(category)
        if (!slaHours) continue

        const app = new GlideRecord('x_winu_hireme_application')
        if (!app.get(ga.getValue('application_ref'))) continue
        if (app.getValue('status') === 'received') continue // not yet reviewed

        // getNumericValue() is epoch milliseconds on both GlideDateTime
        // instances; diffing those directly avoids relying on GlideDuration's
        // undocumented numeric accessor.
        const scoredMs = new GlideDateTime(ga.getValue('scored_at')).getNumericValue()
        const updatedMs = new GlideDateTime(app.getValue('sys_updated_on')).getNumericValue()
        const hoursElapsed = Math.abs(updatedMs - scoredMs) / 3600000
        if (hoursElapsed <= slaHours) withinSla++
    }
    return total === 0 ? null : round2(withinSla / total)
}

function interviewCompletionRate() {
    const invited = countWhere('x_winu_hireme_interview_session', 'statusINin_progress,completed,reviewed')
    const total = countAll('x_winu_hireme_interview_session')
    if (total === 0) return null
    return round2(invited / total)
}

/** Accepted decisions as a share of all decided applications. */
function offerConversionRate() {
    const decided = countWhere('x_winu_hireme_application', 'final_decisionISNOTEMPTY')
    if (decided === 0) return null
    const accepted = countWhere('x_winu_hireme_application', 'final_decision=accepted')
    return round2(accepted / decided)
}

/**
 * Fairness-audit signal (p.10): variance of current scores. A rising number
 * over time is the early-warning sign to investigate for systemic bias —
 * this job reports the number, the investigation is a human process.
 */
function scoreVariance() {
    const ga = new GlideAggregate('x_winu_hireme_scoring_result')
    ga.addQuery('is_current', 'true')
    ga.query()

    const scores = []
    while (ga.next()) {
        const s = parseInt(ga.getValue('score'), 10)
        if (!isNaN(s)) scores.push(s)
    }
    if (scores.length < 2) return null

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((a, b) => a + (b - mean) * (b - mean), 0) / scores.length
    return round2(variance)
}

function categoryDistribution() {
    const ga = new GlideAggregate('x_winu_hireme_scoring_result')
    ga.addQuery('is_current', 'true')
    ga.groupBy('category')
    ga.addAggregate('COUNT', 'sys_id')
    ga.query()

    const dist = {}
    while (ga.next()) {
        dist[ga.getValue('category')] = parseInt(ga.getAggregate('COUNT', 'sys_id'), 10) || 0
    }
    return dist
}

function round2(n) {
    return Math.round(n * 100) / 100
}

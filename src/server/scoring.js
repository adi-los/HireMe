/**
 * HireMe scoring engine (blueprint p.09).
 *
 * Deliberately pure: no Glide, no network, no globals. That keeps the one
 * piece of genuine business logic in the app unit-testable off-instance, and
 * makes the "explainability breakdown" a plain data structure rather than
 * something reconstructed in the UI.
 *
 * The AI Agent supplies the five criterion sub-scores (0-100) and a
 * data_confidence (0-1); this module owns the arithmetic and the banding so
 * that changing a weight can never silently change what a category means.
 */

/**
 * Weights exactly as written in the blueprint.
 *
 * ⚠️ These sum to 0.90, not 1.00. A candidate who scores a perfect 100 on
 * every criterion with full data confidence tops out at 90 — which makes the
 * "Top Match (85-100)" band only 5 points wide and 91-100 unreachable.
 * See docs/open-questions.md #3. Left faithful to the blueprint on purpose;
 * flip NORMALIZE to true (or fix the weights) once the owner decides.
 */
export const DEFAULT_WEIGHTS = {
    skills_match: 0.4,
    experience_relevance: 0.25,
    education_fit: 0.1,
    soft_skills_signal: 0.1,
    logistics_fit: 0.05,
}

/** Penalty applied against missing/uncertain parsed data. */
export const CONFIDENCE_PENALTY = 0.1

/** Category thresholds, inclusive lower bounds (blueprint p.09). */
export const CATEGORY_BANDS = [
    { key: 'top_match', label: 'Top Match', min: 85, sla_hours: 24 },
    { key: 'strong_fit', label: 'Strong Fit', min: 70, sla_hours: 48 },
    { key: 'potential', label: 'Potential', min: 50, sla_hours: 72 },
    { key: 'not_a_fit', label: 'Not a Fit', min: 0, sla_hours: 120 },
]

/** Weight given to the AI interview when blending (blueprint p.14). */
export const INTERVIEW_BLEND = { original: 0.7, interview: 0.3 }

function clamp(n, lo, hi) {
    if (typeof n !== 'number' || isNaN(n)) return lo
    return Math.min(hi, Math.max(lo, n))
}

/**
 * Compute the weighted score plus its per-criterion breakdown.
 *
 * @param {Object} criteria  sub-scores 0-100, keyed as in DEFAULT_WEIGHTS
 * @param {number} dataConfidence  0-1, how cleanly the CV parsed
 * @param {Object} [options]  { weights, normalize, modelVersion }
 * @returns {{score:number, category:string, breakdown:Object}}
 */
export function computeScore(criteria, dataConfidence, options) {
    const opts = options || {}
    const weights = opts.weights || DEFAULT_WEIGHTS
    const confidence = clamp(dataConfidence, 0, 1)

    const contributions = {}
    let weighted = 0
    let weightTotal = 0

    for (const key in weights) {
        const value = clamp(criteria ? criteria[key] : 0, 0, 100)
        const weight = weights[key]
        const contribution = value * weight

        contributions[key] = {
            value: value,
            weight: weight,
            contribution: round2(contribution),
        }
        weighted += contribution
        weightTotal += weight
    }

    // Optional rescale so a perfect candidate can actually reach 100.
    if (opts.normalize && weightTotal > 0) {
        weighted = weighted / weightTotal
    }

    const penalty = CONFIDENCE_PENALTY * (1 - confidence) * 100
    const raw = weighted - penalty
    const score = Math.round(clamp(raw, 0, 100))

    return {
        score: score,
        category: categorize(score),
        breakdown: {
            criteria: contributions,
            data_confidence: confidence,
            penalty: round2(penalty),
            weight_total: round2(weightTotal),
            normalized: !!opts.normalize,
            raw_score: round2(raw),
            model_version: opts.modelVersion || 'unset',
        },
    }
}

/** Map a 0-100 score onto a category key. */
export function categorize(score) {
    const s = clamp(score, 0, 100)
    for (let i = 0; i < CATEGORY_BANDS.length; i++) {
        if (s >= CATEGORY_BANDS[i].min) return CATEGORY_BANDS[i].key
    }
    return 'not_a_fit'
}

/** Review SLA in hours for a category key. */
export function slaHoursFor(categoryKey) {
    for (let i = 0; i < CATEGORY_BANDS.length; i++) {
        if (CATEGORY_BANDS[i].key === categoryKey) return CATEGORY_BANDS[i].sla_hours
    }
    return null
}

/**
 * Blend a completed AI interview sub-score into the original score.
 * Only call this once the interview status is 'completed' — otherwise the
 * original score stands (blueprint p.14).
 */
export function blendInterviewScore(originalScore, interviewSubscore) {
    const original = clamp(originalScore, 0, 100)
    const interview = clamp(interviewSubscore, 0, 100)
    const blended = Math.round(
        INTERVIEW_BLEND.original * original + INTERVIEW_BLEND.interview * interview
    )
    return {
        score: blended,
        category: categorize(blended),
        breakdown: {
            original_score: original,
            interview_subscore: interview,
            weights: INTERVIEW_BLEND,
        },
    }
}

function round2(n) {
    return Math.round(n * 100) / 100
}

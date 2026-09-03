import { gs } from '@servicenow/glide'
import { DEFAULT_WEIGHTS } from '../scoring.js'

/**
 * Typed reads of the `x_winu_hireme.*` system properties.
 *
 * Every getter falls back to a safe default, so a missing or corrupted
 * property degrades the app rather than breaking it. Blueprint p.17 wants
 * scoring weights feature-flagged — this is the read side of that.
 */

export function getBool(name, fallback) {
    const raw = gs.getProperty(name, String(!!fallback))
    return String(raw).toLowerCase() === 'true'
}

export function getInt(name, fallback) {
    const raw = parseInt(gs.getProperty(name, String(fallback)), 10)
    return isNaN(raw) ? fallback : raw
}

export function getString(name, fallback) {
    const raw = gs.getProperty(name, fallback == null ? '' : String(fallback))
    return raw == null ? '' : String(raw)
}

/**
 * Scoring weights from configuration, validated.
 *
 * A malformed or partial weights property silently reverting to blueprint
 * defaults is the right failure mode: scores stay comparable across records
 * instead of half the queue being scored on a broken scale.
 */
export function getScoringWeights() {
    const raw = getString('x_winu_hireme.scoring.weights', '')
    if (!raw) return DEFAULT_WEIGHTS

    let parsed
    try {
        parsed = JSON.parse(raw)
    } catch (e) {
        gs.error('[HireMe] scoring.weights is not valid JSON; falling back to blueprint defaults: ' + e)
        return DEFAULT_WEIGHTS
    }
    if (!parsed || typeof parsed !== 'object') return DEFAULT_WEIGHTS

    const out = {}
    let count = 0
    for (const key in DEFAULT_WEIGHTS) {
        const v = parsed[key]
        if (typeof v === 'number' && !isNaN(v) && v >= 0) {
            out[key] = v
            count++
        } else {
            out[key] = DEFAULT_WEIGHTS[key]
        }
    }
    if (count === 0) {
        gs.warn('[HireMe] scoring.weights contained no usable criteria; using blueprint defaults')
        return DEFAULT_WEIGHTS
    }
    return out
}

export function getScoringOptions() {
    return {
        weights: getScoringWeights(),
        normalize: getBool('x_winu_hireme.scoring.normalize', false),
        modelVersion: getString('x_winu_hireme.scoring.model_version', 'rules-v1'),
    }
}

export const config = {
    useLlm: () => getBool('x_winu_hireme.scoring.use_llm', false),
    ocrEnabled: () => getBool('x_winu_hireme.ocr.enabled', false),
    ocrEndpoint: () => getString('x_winu_hireme.ocr.endpoint', ''),
    ocrCallbackToken: () => getString('x_winu_hireme.ocr.callback_token', ''),
    ocrSlaMinutes: () => getInt('x_winu_hireme.ocr.sla_minutes', 15),
    retentionMonths: () => getInt('x_winu_hireme.retention.months', 24),
    autoInviteTopMatch: () => getBool('x_winu_hireme.interview.auto_invite_top_match', false),
    // Read but deliberately never acted on without a recruiter — see p.09/p.11.
    autoRejectEnabled: () => getBool('x_winu_hireme.decision.auto_reject_enabled', false),
}

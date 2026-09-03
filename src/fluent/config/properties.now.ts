import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

/**
 * Runtime configuration.
 *
 * Blueprint p.17: "scoring weights are feature-flagged, no redeploy needed".
 * That is what these are for — an admin can retune scoring from the UI, and
 * the change is picked up on the next scoring run.
 *
 * Governance rule that goes with it (p.11): any change to scoring weights
 * requires peer review, a version bump on `scoring.model_version`, and a
 * passing ATF regression suite before it reaches production.
 */

/* ---------------- Scoring ---------------- */

Property({
    $id: Now.ID['prop_scoring_weights'],
    name: 'x_winu_hireme.scoring.weights',
    type: 'string',
    // Blueprint p.09 weights. Note they sum to 0.90 — see docs/open-questions.md #3.
    value: '{"skills_match":0.40,"experience_relevance":0.25,"education_fit":0.10,"soft_skills_signal":0.10,"logistics_fit":0.05}',
    description: 'JSON map of scoring criterion weights. Peer review + model_version bump required before changing in prod.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_scoring_normalize'],
    name: 'x_winu_hireme.scoring.normalize',
    type: 'boolean',
    // false = faithful to the blueprint (max achievable score is 90).
    // true  = rescale so a perfect candidate reaches 100.
    value: false,
    description: 'Rescale by the weight total so a perfect candidate can reach 100. See open-questions #3.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_scoring_model_version'],
    name: 'x_winu_hireme.scoring.model_version',
    type: 'string',
    value: 'rules-v1',
    description: 'Stamped onto every ScoringResult for the fairness audit. Bump whenever weights or prompts change.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_scoring_use_llm'],
    name: 'x_winu_hireme.scoring.use_llm',
    type: 'boolean',
    // false = deterministic rule-based sub-scores only (works with no AI
    // licensing at all). true = ask the LLM to refine them.
    value: false,
    description: 'Use the LLM to produce criterion sub-scores. When false, the deterministic matcher is used alone.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

/* ---------------- Interview ---------------- */

Property({
    $id: Now.ID['prop_interview_auto_top_match'],
    name: 'x_winu_hireme.interview.auto_invite_top_match',
    type: 'boolean',
    value: false,
    description: 'Auto-invite Top Match candidates to the AI interview when the job offer allows it (p.14).',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

/* ---------------- OCR ---------------- */

Property({
    $id: Now.ID['prop_ocr_enabled'],
    name: 'x_winu_hireme.ocr.enabled',
    type: 'boolean',
    value: false,
    description: 'Master switch for outbound OCR calls. Leave false until a provider is configured.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_ocr_endpoint'],
    name: 'x_winu_hireme.ocr.endpoint',
    type: 'string',
    value: '',
    description: 'Base URL of the OCR provider. Set per environment; provider choice is deliberately not hard-coded (p.04).',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_ocr_callback_token'],
    name: 'x_winu_hireme.ocr.callback_token',
    type: 'string',
    value: '',
    description: 'Shared secret the OCR provider must echo on the callback endpoint. Set manually per environment; never commit a value.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_ocr_sla_minutes'],
    name: 'x_winu_hireme.ocr.sla_minutes',
    type: 'integer',
    value: 15,
    description: 'OCR extraction SLA in minutes (blueprint p.11). Breaches are flagged by the monitor job.',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

/* ---------------- Governance ---------------- */

Property({
    $id: Now.ID['prop_retention_months'],
    name: 'x_winu_hireme.retention.months',
    type: 'integer',
    value: 24,
    description: 'Months to retain candidate PII after a final decision before anonymization (p.11).',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

Property({
    $id: Now.ID['prop_auto_reject_enabled'],
    name: 'x_winu_hireme.decision.auto_reject_enabled',
    type: 'boolean',
    // Blueprint p.09/p.11 is explicit: nothing below threshold is sent without
    // RH sign-off. This exists so the answer is auditable, not so it can be
    // flipped casually.
    value: false,
    description: 'MUST remain false. No auto-rejection without recruiter sign-off (p.09/p.11).',
    roles: { read: ['x_winu_hireme.admin'], write: ['x_winu_hireme.admin'] },
})

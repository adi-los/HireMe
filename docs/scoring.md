# Scoring specification

Implemented in [`src/server/scoring.js`](../src/server/scoring.js).
Covered by 8 unit tests in [`tests/scoring.test.mjs`](../tests/scoring.test.mjs) — run `npm test`.

## The formula (blueprint p.09)

```
score = 0.40 * skills_match
      + 0.25 * experience_relevance
      + 0.10 * education_fit
      + 0.10 * soft_skills_signal
      + 0.05 * logistics_fit
      - 0.10 * (1 - data_confidence)   // penalty
```

All five criteria are 0–100. `data_confidence` is 0–1.

> ⚠️ The weights sum to **0.90**. A perfect candidate scores 90, and 91–100 is
> unreachable. See [open-questions.md #3](open-questions.md#3-the-scoring-weights-sum-to-090-not-100--verified)
> — `computeScore(..., { normalize: true })` is the one-line fix.

## Division of responsibility

The AI agent produces **judgements**; this module does the **arithmetic**.

- Agent returns the five sub-scores and a confidence — things that need
  language understanding.
- `scoring.js` owns the weights, the penalty, the banding and the breakdown —
  things that must be deterministic, reviewable and testable.

This is what makes "every AI output is explainable" (p.11) verifiable rather
than aspirational, and it means changing a weight cannot silently change what a
category means.

## Categories and SLAs (p.09)

| Category | Score | RH action | Review SLA |
|---|---|---|---|
| `top_match` | 85–100 | Direct interview invite | 24h |
| `strong_fit` | 70–84 | Phone screen or AI interview | 48h |
| `potential` | 50–69 | Manual review, keep warm | 72h |
| `not_a_fit` | < 50 | Polite rejection — **never auto-sent without RH sign-off** | 5 business days |

## Breakdown payload

Stored in `x_winu_hireme_scoring_result.breakdown_json`. This is what the RH
workspace renders as the explainability panel.

```json
{
  "criteria": {
    "skills_match":         { "value": 80, "weight": 0.40, "contribution": 32 },
    "experience_relevance": { "value": 60, "weight": 0.25, "contribution": 15 },
    "education_fit":        { "value": 40, "weight": 0.10, "contribution": 4 },
    "soft_skills_signal":   { "value": 50, "weight": 0.10, "contribution": 5 },
    "logistics_fit":        { "value": 100, "weight": 0.05, "contribution": 5 }
  },
  "data_confidence": 0.9,
  "penalty": 1,
  "weight_total": 0.9,
  "normalized": false,
  "raw_score": 60,
  "model_version": "scoring-agent-v1"
}
```

`model_version` is mandatory for the fairness audit (p.10) and the change-management
rule that a weight change requires an agent version bump (p.11).

## Interview blending (p.14)

```
final_score = 0.7 * original_score + 0.3 * interview_subscore
```

Applied **only** once `InterviewSession.status = 'completed'`; otherwise the
original score stands. A blended result is written as a **new** `ScoringResult`
row with `is_current = true`, and the previous row is flipped to `false` —
scores are never overwritten, so the audit trail keeps every verdict.

Note this can demote: an 88 with a weak 40 interview lands at 74, out of Top
Match. That is intended, and it is unit-tested.

## Re-scoring

Always insert a new row. Never `UPDATE` a `ScoringResult`. The table has no
recruiter write ACL for exactly this reason (`src/fluent/security/acls.now.ts`).

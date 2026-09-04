# Open questions — decide these before building further

Ordered by how expensive they get to change later. #1–#3 are cheap now and
painful after the first deploy.

---

## 1. ~~Should `Application` extend `task`?~~ — DECIDED: standalone

**Status: settled 2026-09-03, before the first deploy. Standalone.**
The app is now installed on the dev instance with `x_winu_hireme_application`
as a standalone table, so this is locked in — changing the parent now means
dropping and recreating the table.

Consequence to carry forward: SLA timers, recruiter assignment and work notes
are **ours to build**, not inherited. Budget for that in weeks 3–4.

<details>
<summary>Original analysis (kept for the record)</summary>

Built as a standalone table, faithful to the blueprint data model (p.07).

The blueprint asks for things `task` gives you for free:

- SLAs per category (24h / 48h / 72h / 5 days — p.09, p.11)
- "assigned recruiter" and a review queue (p.12)
- work notes / activity stream behind "Add Note" (p.12)

Built standalone, each of those is hand-rolled. Built on `task`, they are
platform features — but you inherit task's ACLs, its `state` field alongside
our `status`, and a heavier form.

**Why it's urgent:** changing a table's parent after records exist is not a
supported in-place migration. This is a first-week decision, not a later one.

**Recommendation:** extend `task` if SLA tracking is genuinely in scope for v1;
stay standalone if the first release is really just intake + scoring.

</details>

---

## 2. How does a candidate authenticate? — IMPLEMENTED: tokenised magic link

**Status: built, not just decided.** The blueprint has a **public** job board
and portal (p.13) plus a `candidate` role that can "view & edit own
application only" (p.11) — but a public applicant is not necessarily a
`sys_user`, so a login-based ACL had nothing to check.

Implemented the "tokenised magic link" option from the table below:
`Application.access_token` is a GUID issued by `submitApplication()`
(`src/server/glide/intake.js`) at apply time. The candidate-facing REST API
(`hireme_portal/status/{id}?access_token=...`) requires it to read anything
back, and never returns score or category regardless. The `x_winu_hireme.candidate`
role and its email-match ACLs still exist for the case where a candidate *is*
a real `sys_user` (e.g. an internal referral), but the public flow no longer
depends on that.

Real cost paid for this: the portal's REST endpoints run under the platform's
**guest session**, which has no HireMe role at all. That required narrow
public `create` ACLs on `Candidate`/`Application`/`CVDocument` (create only —
read/write/delete stay role-restricted), a field-scoped public write on
`Candidate.consent_given_at` for a returning applicant, and a condition-based
public read on `Application` gated by "access_token is populated" (the actual
secret comparison happens in script, since an ACL can't see the caller's query
parameters). All four are in `src/fluent/security/acls.now.ts` with inline
rationale — read those comments before touching this area, the reasoning
matters more than the pattern.

**Original options considered, for the record:**

| Option | Cost | Notes |
|---|---|---|
| Public sign-up creates a real `sys_user` | Medium | Cleanest ACL story; needs user-provisioning + password flows. Not built. |
| **Tokenised magic link per application** | Low | **Built.** No login; token required on every status read. |
| Keep email matching only | Lowest | Kept as a secondary path for candidates who are real sys_users. |

**Still open:** the token travels in a URL query string (`?access_token=...`),
which browsers log in history and servers may log in access logs. Acceptable
for a v1 status-check endpoint that leaks no score/PII beyond what's already
in the URL the candidate holds; revisit if this needs to survive a security
review.

---

## 3. The scoring weights sum to 0.90, not 1.00 — verified

From the blueprint formula (p.09):

```
0.40 + 0.25 + 0.10 + 0.10 + 0.05 = 0.90
```

**Consequence, confirmed by a passing unit test** (`tests/scoring.test.mjs`):
a candidate scoring a perfect 100 on every criterion with full data confidence
scores **90**, not 100.

That means:

- **91–100 is unreachable.** The "Top Match (85–100)" band is really 85–90.
- Only ~5 points separate a flawless candidate from the Strong Fit boundary,
  so the top category is far narrower than the distribution chart on p.09
  (12% Top Match) implies.
- The `-0.10 * (1 - data_confidence)` penalty then pushes a poorly-parsed CV
  down a further 10 points, out of Top Match entirely.

**Three ways out:**

1. **Renormalize** — divide by the weight total. `computeScore(..., { normalize: true })`
   already does this and is unit-tested. A perfect candidate reaches 100.
2. **Fix the weights** — e.g. raise `skills_match` to 0.50 so they sum to 1.00.
3. **Accept it** — move the band boundaries down to match a 0–90 scale.

**Recommendation:** option 1. It leaves the published weights untouched (they
still express the intended *ratios*) while making the category bands mean what
p.09 says they mean. It is a one-line change: flip the flag in the scoring flow.

---

## 4. Which OCR and which LLM?

The architecture deliberately keeps these behind Scripted REST / Integration Hub
so the provider can change (p.04) — good design, but v1 still needs a pick:

- **OCR:** Now Assist Document Intelligence? Azure Document Intelligence (named
  on p.04)? Something else? This drives the callback contract in the async
  extraction flow and the `<15 min` SLA on p.11.
- **LLM:** the platform's own `sn_generative_ai.LLMClient` (no egress, no extra
  contract) versus an external API (more model choice, needs credentials, data
  residency review).

Note the blueprint promises a **97% OCR success rate** (p.10) — that is a
provider-dependent number and should be treated as a target to validate, not a
given.

---

## 5. Is AI Agent Studio licensed on the target instance? — CONFIRMED: no

**Status: checked directly on the instance, 2026-09-04, not guessed.**
`sys_db_object` has zero tables starting with `sn_aia` — AI Agent Studio is
not installed. The documented fallback, `sn_generative_ai.LLMClient`, is
**also unavailable**: zero `sn_generative_*` tables either. This is a
ServiceNow University lab instance (`nowlearning-nlinst...`); it appears to
carry neither AI license.

Consequence: any "AI" feature (scoring agent, interview agent, chatbot
Copilot) needs an **external LLM API** reached via `RestMessage`/`RestApi`
from a Script Include, not a native ServiceNow AI construct. The scoring
engine in `src/server/scoring.js` is deliberately provider-agnostic and
already expects this shape — it takes five sub-scores + confidence from
wherever they come from, native agent or external API call, and does the
weighting itself either way.

**Provider decided 2026-09-04: OpenRouter.** Verified working outside this
environment with a real `curl` call before being wired in (`meta-llama/
llama-3.3-70b-instruct`, OpenAI-compatible request/response shape,
`Authorization: Bearer` auth). `src/server/glide/llm-client.js` and
`x_winu_hireme.llm.provider` default to it; Anthropic/OpenAI native shapes
stay supported as a config swap if the provider ever changes.

**Real constraint this adds:** an external API needs an API key. Per this
session's standing rule, Claude does not type credentials into any field —
the user must add the key as a ServiceNow Connection & Credential alias (or
system property) themselves; Claude can build the `RestMessage` scaffolding
that references that alias by name.

---

## 6. Retention: who runs the 24-month anonymization?

p.11 promises "24-month retention post-decision, then auto-anonymized" plus
on-request deletion. That needs a scheduled job, an anonymization routine that
preserves `AuditLog` integrity while scrubbing PII, and a decision about what
"anonymized" means for a stored CV binary (delete the attachment outright?).

Not urgent for a dev build; must exist before any real candidate data is loaded.

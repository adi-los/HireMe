# Open questions — decide these before building further

Ordered by how expensive they get to change later. #1–#3 are cheap now and
painful after the first deploy.

---

## 1. Should `Application` extend `task`? — decide BEFORE first deploy

**Status:** built as a standalone table, faithful to the blueprint data model (p.07).

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

---

## 2. How does a candidate authenticate? — blocks the candidate ACLs

The blueprint has a **public** job board and portal (p.13) plus a `candidate`
role that can "view & edit own application only" (p.11). Those two facts sit
awkwardly together: a public applicant is not a `sys_user`, so there is nothing
for an ACL to match on.

The `Candidate` table currently has no `sys_user` reference. The ownership ACL
in `src/fluent/security/acls.now.ts` matches on **email** as a placeholder —
functional, but weak (email is user-editable in many setups).

**Options:**

| Option | Cost | Notes |
|---|---|---|
| Public sign-up creates a real `sys_user` | Medium | Cleanest ACL story; needs user-provisioning + password flows |
| Tokenised magic link per application | Low | No login; token in the "My Applications" URL. Good for v1 |
| Keep email matching | Lowest | Only safe if candidate accounts are provisioned and email is locked |

**Nothing else is blocked by this** — recruiter/manager/admin ACLs are complete
and correct regardless.

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

## 5. Is AI Agent Studio licensed on the target instance?

`AiAgent` requires SDK ≥ 4.4.0 (we have 4.11.2) **and** an AI Agent Studio
subscription on the instance. Worth confirming on the PDI before week 5, since
the whole AI layer (p.16) assumes it.

If it is not available, the fallback is Flow Designer + `sn_generative_ai.LLMClient`
in a Script Include — same scoring contract, no Agent Studio. The scoring engine
in `src/server/scoring.js` is deliberately provider-agnostic and works either way.

---

## 6. Retention: who runs the 24-month anonymization?

p.11 promises "24-month retention post-decision, then auto-anonymized" plus
on-request deletion. That needs a scheduled job, an anonymization routine that
preserves `AuditLog` integrity while scrubbing PII, and a decision about what
"anonymized" means for a stored CV binary (delete the attachment outright?).

Not urgent for a dev build; must exist before any real candidate data is loaded.

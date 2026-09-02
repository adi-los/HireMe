# AI layer — decision brief

**No agent code has been written yet, on purpose.**

The SDK's own `building-ai-agents-guide` sets a hard gate: four questions must be
answered by a human before any `.now.ts` agent code is generated, and it names
"inferring the answers because the purpose sounded obvious" as the single most
common failure mode. Two of the four also need live queries against the instance
(`sys_user`, `sys_user_role`, `sn_aia_agent`), which need credentials this
machine does not have.

So: answer the four below, confirm the instance prerequisites, and the three
agents can be written quickly and correctly.

Read first: `now-sdk explain building-ai-agents-guide`.

---

## Prerequisites to confirm on the instance

- [ ] AI Agent Studio is licensed and active (see open-questions.md #5)
- [ ] `now-sdk auth --list` shows the target PDI/dev instance
- [ ] Query `sn_aia_agent` for name collisions before creating anything —
      duplicate-ish names make the platform pick the wrong agent at runtime

---

## The four gate questions

### Q1 — Authentication: Dynamic User or AI User?

*Which identity does the agent act as?*

Relevant blueprint constraint: every AI output is advisory and attributed
(p.11). An **AI User** gives you a distinct, queryable identity in `AuditLog`
— which fits `actor_type: 'ai'` on the audit table. **Dynamic User** runs as the
invoking recruiter, which blurs that line.

**Leaning:** AI User, for attribution. Needs `sys_user` query
(`identity_type=ai_agent`) to pick one.

### Q2 — Security roles (only if Dynamic User)

Which roles the agent may read data under. Never use `Now.ID` for these —
resolve real sys_ids from `sys_user_role`. `maint` is not allowed.

Minimum surface the scoring agent needs: read on `x_winu_hireme_candidate_profile`
and `x_winu_hireme_job_offer`; write on `x_winu_hireme_scoring_result`.

### Q3 — Trigger

*Manual, record create/update, scheduled, or email?* A condition is mandatory.

Blueprint says (p.05 step 5): scoring fires when the profile is ready.

**Leaning:** record create on `x_winu_hireme_candidate_profile`. But note the
blueprint orchestrates via **Flow Designer** (p.04) — so the cleaner design may
be *no* agent trigger at all, with the flow calling the agent. Decide which owns
the orchestration; do not build both.

### Q4 — ACL access: who can invoke it?

Any authenticated user / specific roles / public.

**Leaning:** specific roles — `x_winu_hireme.recruiter` and
`x_winu_hireme.admin`. The Copilot must never be publicly invokable, and
candidates must not reach the scoring agent at all (p.11).

---

## The three agents, once the gate clears

| Agent | Input | Output | Notes |
|---|---|---|---|
| **Scoring** | CandidateProfile + JobOffer.requirements | 5 criterion sub-scores (0–100) + data_confidence | Must NOT do the arithmetic — `src/server/scoring.js` owns weights, banding and the breakdown. Keeps scoring auditable and testable. |
| **Interview** | JobOffer + CV gaps | 5–8 questions; then per-answer rubric scores + flags | Two distinct calls: generation, then evaluation. |
| **Copilot skill** | Recruiter question + Application-scoped records | Grounded answer + citations | Citations land in `ChatInteraction.citations`. Must be scoped to one application — never allowed to range across candidates. |

**Design note worth keeping:** the agent returns *judgements*, the code does the
*maths*. That split is what makes p.11's "every score shows its breakdown" and
the fairness audit on p.10 actually verifiable — the deterministic half is
already covered by 8 passing unit tests.

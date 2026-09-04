# AI layer — decision brief

**No agent code has been written yet.** The four gate questions below were
answered by the user on 2026-09-04 (see decisions inline). What's still
outstanding is the three prerequisites — those need a live instance query,
which needs the user logged in (this machine holds no ServiceNow
credentials), not a judgment call. Once those are confirmed, agent code can
be written.

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

### Q1 — Authentication: Dynamic User or AI User? — DECIDED: AI User

*Which identity does the agent act as?*

**Decided 2026-09-04: AI User.** Gives a distinct, queryable identity in
`AuditLog` (`actor_type: 'ai'`), separate from whichever recruiter triggered
it — matches blueprint p.11's "every AI output is advisory and attributed."

**Still needed before writing agent code:** an actual `sys_user` sys_id with
`identity_type=ai_agent` to reference. Query the instance for an existing one
first (`sys_user` where `identity_type=ai_agent`); create one only if none
exists. This is one of the outstanding prerequisites below — not resolved yet.

### Q2 — Security roles — N/A, AI User was chosen

This question only applies to Dynamic User. Since Q1 was decided as AI User,
the agent's access is governed by whatever roles are granted to the AI User
`sys_user` record directly (via `sys_user_has_role`, same pattern as the demo
users in `src/fluent/demo/demo-users.now.ts` — remember `state: 'active'`),
not by the invoking recruiter's roles. Grant it the minimum surface: read on
`x_winu_hireme_candidate_profile` and `x_winu_hireme_job_offer`, write on
`x_winu_hireme_scoring_result`. Nothing else.

### Q3 — Trigger — DECIDED: pipeline calls the agent, no agent-side trigger

*Manual, record create/update, scheduled, or email?* A condition is mandatory.

**Decided 2026-09-04: the pipeline owns orchestration; the agent has no
platform-level trigger of its own.** `src/server/glide/pipeline.js` calls the
scoring agent as one step, the same way it already calls OCR and the
rule-based parser. This was explicitly chosen over "agent triggers itself on
CandidateProfile create" specifically to avoid two competing trigger sources
firing scoring twice — the failure mode the original brief flagged.

### Q4 — ACL access: who can invoke it? — DECIDED: specific roles

Any authenticated user / specific roles / public.

**Decided 2026-09-04: specific roles** — `x_winu_hireme.recruiter` and
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

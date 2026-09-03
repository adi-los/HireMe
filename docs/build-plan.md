# Build plan & status

Tracks the 12-week roadmap on blueprint p.18 against what is actually in this repo.

Legend: ✅ done and verified · 🟡 partial · ⬜ not started · 🔒 blocked on a decision

---

## Phase 0 · Environment (blueprint p.15)

| | Item | Notes |
|---|---|---|
| ✅ | Node 20+ | v24.3.0 |
| ✅ | `@servicenow/sdk` installed | 4.11.2 (pinned in package.json) |
| ✅ | Project scaffolded | `now-sdk init`, scope `x_winu_hireme` |
| ✅ | `now-sdk build` passes offline | verified repeatedly |
| ✅ | Git repository | initialised, first commit made |
| ✅ | **Instance auth** | alias `dev`, user `admin`, nowlearning lab instance |
| ⬜ | Git remote | `git remote add origin <repo-url>` |

> The lab instance may be reclaimed or reset on a schedule — push to a remote
> so the source isn't only on this machine.

---

## Weeks 1–2 · Foundations

| | Item | Where |
|---|---|---|
| ✅ | All 10 tables as Fluent `Table()` | `src/fluent/tables/` |
| ✅ | 4 roles | `src/fluent/security/roles.now.ts` |
| ✅ | ACLs for the governance matrix | `src/fluent/security/acls.now.ts` |
| 🔒 | Candidate ownership ACL | placeholder email match — open-questions #2 |
| ✅ | `Application extends task`? | **decided: standalone**, locked in by the deploy |
| ✅ | Deploy to dev | installed and verified on the instance |

---

## Weeks 3–4 · Core flows — done, built as business rules rather than Flow Designer

| | Item | Notes |
|---|---|---|
| ✅ | Application intake | Public REST API (`hireme_portal/apply`), since candidates aren't sys_users — `src/server/glide/intake.js` |
| ✅ | Candidate profile matching | `src/server/matching.js` — 5 criteria vs `JobOffer.requirements`, 15 tests |
| ✅ | Profile parsing | `src/server/profile-parser.js` — rule-based, 10 tests. LLM refinement pass exists (`pipeline.js`) but is off by default (`scoring.use_llm=false`) |
| ✅ | OCR integration | Outbound `RestMessage` + inbound webhook, provider-agnostic, off by default (`ocr.enabled=false`) — provider still undecided, open-questions #4 |
| ✅ | Status transitions | driven by business rules on `Application`/`CVDocument`/`InterviewSession`, not a Flow Designer flow |
| ✅ | "My Applications" status check | token-gated public endpoint (`hireme_portal/status/{id}`) — never exposes score |
| ✅ | "I'm Interested" soft-apply | `hireme_portal/interest` |

**Deliberate deviation from the blueprint's "Flow Designer" plan (p.04):** everything
here is Business Rules + Scheduled Scripts instead. Same triggers, same outcome,
easier to unit-test the surrounding logic, harder to hand to a non-technical
admin to tweak visually. Revisit if that visual-editability matters to you.

---

## Weeks 5–6 · AI layer — arithmetic and matching done; the agents are gated

| | Item | Notes |
|---|---|---|
| ✅ | Scoring arithmetic + banding + blending | `src/server/scoring.js`, 8 tests |
| ✅ | Deterministic criteria matching | `src/server/matching.js` — this is what actually produces the 5 sub-scores today |
| ✅ | Pipeline wiring | CV → OCR → profile → match → score → category, all the way to `ScoringResult`, fully automated |
| 🔒 | Scoring Agent (LLM refinement of the 5 sub-scores) | gated on the 4 questions in `ai-agents-brief.md`; `sn_generative_ai.LLMClient` call is written and guarded, just switched off |
| 🔒 | Interview Agent | same gate — no question generation or answer evaluation exists yet |
| 🔒 | Copilot skill | same gate — no natural-language grounding exists yet |

**The app works end to end without any AI Agent Studio license** — matching and
scoring run on the rule-based engine alone. The agents are a quality upgrade
layered on top (`scoring.use_llm=true`), not a dependency.

---

## Weeks 7–9 · Experience

| | Item |
|---|---|
| ⬜ | RH Workspace (queue, CV viewer + profile, Copilot panel, action bar) — p.12 |
| ⬜ | Candidate portal (job board, apply flow, "I'm interested", My Applications) — p.13 |
| ⬜ | Virtual Agent topic "HireMe Assistant" |

`now-sdk explain creating-workspaces-guide` covers the workspace API.

---

## Weeks 10–11 · Quality

| | Item |
|---|---|
| ✅ | Unit tests | 31 passing — scoring, matching, profile parsing, all offline |
| ✅ | CI workflow | `.github/workflows/hireme-ci.yml` — build + tests run on every PR |
| ✅ | Backend deployed to dev | all 11 tables, 5 roles, 34 ACLs, 8 business rules, 2 REST APIs (4 routes), 2 scheduled jobs, 11 properties, 16 nav modules — every count verified against the live instance, not just the installer's own "success" message |
| ⬜ | ATF suites | `now-sdk explain atf-guide` — none written; the 31 offline tests cover the pure logic, ATF would cover the Glide-dependent pipeline/business-rule layer that can't run outside an instance |
| ⬜ | Security review of ACLs on a real instance | the ACL *design* is done (governance matrix + guest-write scoping for the public portal); nobody has clicked through as each role yet |
| ⬜ | Wire ATF into CI (`now-sdk cicd`) — needs instance secrets |

---

## Week 12 · Go-live

| | Item |
|---|---|
| ⬜ | UAT sign-off |
| ⬜ | Change Request + scheduled window |
| ⬜ | Production install |

---

## Suggested order for the next session

1. Click through the app as each role (impersonate) — the ACL surface is now
   large enough that this is worth doing deliberately rather than trusting
   the design read-through
2. Pick an OCR provider (open-questions #4) — flip `x_winu_hireme.ocr.enabled`
   to true and the pipeline runs for real
3. Decide the AI Agent gate questions in `ai-agents-brief.md` — unlocks the
   LLM refinement pass and the Copilot/Interview agents
4. Then UI (weeks 7–9) — nothing in the backend blocks starting this now

## Note on `npm run deploy`

If `now-sdk install` fails with `Could not determine app installation status`
and the instance's own Upgrade History (`sys_upgrade_history_list.do`) shows
no new entry for the attempt, the install failed before ServiceNow's own
apply-changes engine started — not a metadata problem in the package. This
happened once on the nowlearning lab instance and `now-sdk install --reinstall`
resolved it (uninstall + clean reinstall). Only safe when nothing on the
instance was hand-edited outside this source, since a reinstall discards
metadata that isn't in the local package.

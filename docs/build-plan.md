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
| ⬜ | **Instance auth** | `npx now-sdk auth --add <url> --type basic` — needs your PDI |
| ⬜ | Git remote | `git remote add origin <repo-url>` |

> Auth is the one thing that must happen at your keyboard — it takes a password
> and I don't handle those.

---

## Weeks 1–2 · Foundations

| | Item | Where |
|---|---|---|
| ✅ | All 10 tables as Fluent `Table()` | `src/fluent/tables/` |
| ✅ | 4 roles | `src/fluent/security/roles.now.ts` |
| ✅ | ACLs for the governance matrix | `src/fluent/security/acls.now.ts` |
| 🔒 | Candidate ownership ACL | placeholder email match — open-questions #2 |
| 🔒 | `Application extends task`? | decide **before** first deploy — open-questions #1 |
| ⬜ | Deploy to dev | `npm run deploy` after auth |

---

## Weeks 3–4 · Core flows

| | Item | Notes |
|---|---|---|
| ⬜ | Application intake flow | create Application → status `received` → attach CVDocument |
| ⬜ | OCR integration | Scripted REST + async webhook callback — provider undecided (open-questions #4) |
| ⬜ | Profile parsing | rule-based pass + LLM fallback → `CandidateProfile` |
| ⬜ | Status transitions | `received → screened → interviewing → decided → closed` |

Read `now-sdk explain flow-api` and `restapi-api` before starting.

---

## Weeks 5–6 · AI layer

| | Item | Notes |
|---|---|---|
| ✅ | Scoring arithmetic + banding + blending | `src/server/scoring.js`, 8 tests passing |
| 🔒 | Scoring Agent | gated on the 4 questions in `ai-agents-brief.md` |
| 🔒 | Interview Agent | same gate |
| 🔒 | Copilot skill | same gate |

The deterministic half is done and tested. The agents only need to return five
sub-scores and a confidence — see `scoring.md`.

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
| ✅ | Unit tests for scoring boundaries |
| ✅ | CI workflow | `.github/workflows/hireme-ci.yml` — build + tests run on every PR |
| ⬜ | ATF suites per flow | `now-sdk explain atf-guide` |
| ⬜ | Security review of ACLs on a real instance |
| ⬜ | Wire ATF into CI (`now-sdk cicd`) — needs instance secrets |

---

## Week 12 · Go-live

| | Item |
|---|---|
| ⬜ | UAT sign-off |
| ⬜ | Change Request + scheduled window |
| ⬜ | Production install |

---

## Suggested order for the first session

1. `npx now-sdk auth --add <your-instance> --type basic` *(you, at the keyboard)*
2. Decide open-questions **#1** (task inheritance) — it is the only truly
   irreversible one
3. `npm run verify` then `npm run deploy` — get the 10 tables live on the PDI
4. Poke the tables in the UI, confirm the ACLs behave
5. Then start the intake flow (weeks 3–4)

Decisions #2–#6 can all wait until their phase.

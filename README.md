# HireMe

AI-powered recruitment platform on the ServiceNow AI Platform, built pro-code
with ServiceNow Fluent (`@servicenow/sdk`).

**Scope:** `x_winu_hireme` · **SDK:** 4.11.2

A candidate uploads a CV once; OCR extraction, structured profiling, AI scoring,
categorization and an optional AI-led first interview follow automatically.
Every AI output is explainable and logged, and a human makes every final call.

---

## Quick start

```bash
npm install
npm run verify
```

`verify` runs the Fluent build and the unit tests. Both work **offline** — no
instance needed.

To deploy, authenticate first (interactive, needs your instance password):

```bash
npx now-sdk auth --add https://<your-instance>.service-now.com --type basic
```

Then:

```bash
npm run build && npm run deploy
```

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Compile + validate all Fluent sources |
| `npm test` | Unit tests for the scoring engine |
| `npm run verify` | Build **and** test — use this before committing |
| `npm run deploy` | Install onto the authenticated instance (`now-sdk install`) |
| `npm run clean` | Clear build output |

## Layout

```
src/
  fluent/
    tables/          10 tables — the blueprint data model (p.07/p.08)
    security/        4 roles + governance ACLs (p.11)
  server/
    scoring.js       weighted scoring, banding, interview blending (p.09/p.14)
tests/
  scoring.test.mjs   8 unit tests, no instance required
docs/
  blueprint-source.md   verbatim text of the source PDF
  open-questions.md     decisions needed, most urgent first  ← read this
  scoring.md            scoring spec + breakdown JSON shape
  ai-agents-brief.md    the gate that must clear before agent code
  build-plan.md         12-week roadmap vs. actual status
now.config.json    scope + scopeId
```

## Status

The full backend is built, tested and deployed to a dev instance: 11 tables,
5 roles, 34+ ACLs, the CV-to-score pipeline (OCR call + webhook, rule-based
profile parsing and matching, weighted scoring, interview blending), a public
candidate-portal API (apply / status / "I'm interested"), 2 scheduled jobs
(hourly KPIs, daily retention), and 16 navigator entries. 31 unit tests pass
offline; every record count above was verified against the live instance, not
just the installer's own success message.

The RH Workspace (blueprint p.12) is also built and deployed: a live
dashboard and a 10-list, 3-category queue at `/x/winu/hireme-rh/home`,
verified end-to-end by impersonating a role-only recruiter — not admin,
whose `adminOverrides` would have masked a broken ACL. That verification
pass caught three undocumented platform requirements for UI Builder
workspaces (a baseline `canvas_user` role, a `now.` prefix on `ux_route` ACL
names, and `UxList.roles` silently not working) — see
[`docs/build-plan.md`](docs/build-plan.md) for the full story.

The Action Bar (Accept/Reject/Call/Schedule AI Interview/Add Note) and the
CV Viewer + Profile page are also built, deployed and verified by
impersonation. The CV Viewer hit a real one: the SDK-recommended React data
components (`RecordProvider`, `NowRecordListConnected`, `RelatedLists`)
share a module-level singleton that silently requires the Agent Workspace
app-shell to already be running — confirmed by reading the package's own
source, not guessed — so it crashed on every load inside a bare custom UI
Page. Fixed by reading the same tables directly via the Table API instead.
Full story, and what to avoid if you build another React UI Page, in
[`docs/build-plan.md`](docs/build-plan.md).

The RH Copilot chat panel (blueprint p.12) is also built, deployed and
verified by impersonation — a recruiter can ask a question scoped to one
application and get a cited answer. This instance has neither AI Agent
Studio nor `sn_generative_ai` installed (confirmed directly, not assumed —
see [`docs/open-questions.md`](docs/open-questions.md) #5), so the Copilot
reaches an external LLM (OpenRouter) via a provider-agnostic `RestMessage`
instead. The four AI-agent gate questions were answered 2026-09-04
(see [`docs/ai-agents-brief.md`](docs/ai-agents-brief.md)); the Scoring and
Interview agents themselves aren't built yet, just the Copilot skill.

Not started: the Scoring/Interview agents (LLM refinement layered on top of
the deterministic engine — optional, not a dependency), candidate portal
pages, and the Virtual Agent topic.

Two decisions were made and implemented rather than left open: `Application`
stays standalone (not `task`-derived), and candidate identity uses a
tokenised magic link rather than real `sys_user` accounts. Both are explained,
with the tradeoffs, in [`docs/open-questions.md`](docs/open-questions.md).

## Useful SDK docs

The SDK ships its full documentation locally:

```bash
npx now-sdk explain fluent-overview
npx now-sdk explain table-api
npx now-sdk explain security-guide
npx now-sdk explain building-ai-agents-guide
npx now-sdk explain atf-guide
```

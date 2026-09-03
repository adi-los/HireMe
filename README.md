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
5 roles, 34 ACLs, the CV-to-score pipeline (OCR call + webhook, rule-based
profile parsing and matching, weighted scoring, interview blending), a public
candidate-portal API (apply / status / "I'm interested"), 2 scheduled jobs
(hourly KPIs, daily retention), and 16 navigator entries. 31 unit tests pass
offline; every record count above was verified against the live instance, not
just the installer's own success message.

Not started: the AI agents (deliberately gated — see
[`docs/ai-agents-brief.md`](docs/ai-agents-brief.md)) and the UI Builder
layers (RH Workspace, candidate portal pages). The backend does not depend on
either — matching and scoring run on the deterministic engine with no AI
Agent Studio license required.

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

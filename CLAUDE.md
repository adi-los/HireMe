# CLAUDE.md — working notes for this repo

HireMe: a ServiceNow scoped app (`x_winu_hireme`) built pro-code with Fluent
(`@servicenow/sdk` 4.11.2). Source of truth for requirements is
`docs/blueprint-source.md` (verbatim text of the original PDF).

## Always

- Run `npm run verify` (build + tests) before saying anything works.
  The build validates every `.now.ts`; it catches most mistakes and runs offline.
- The SDK ships its own full docs. **Read them before guessing at an API:**
  `npx now-sdk explain <topic>` — e.g. `table-api`, `security-guide`,
  `flow-api`, `atf-guide`, `building-ai-agents-guide`, `creating-workspaces-guide`.
  Raw files live in `node_modules/@servicenow/sdk/docs/`.

## Fluent gotchas learned the hard way here

- **The PDF's code samples do not match the real API.** The blueprint shows
  `Table({ columns: { x: Column.String(...) } })`. The actual API is
  `Table({ schema: { x: StringColumn(...) } })`. Trust the SDK docs, not the PDF.
- **No expressions in Fluent object literals.** The build statically evaluates
  them, so string concatenation (`'a' + 'b'`) in a property value fails with
  `TS243: Unsupported statement in Fluent source file`. Use single literals.
- **`Role` and `Acl` need `$id: Now.ID['...']`.** Tables do not.
- `import '@servicenow/sdk/global'` is required in any file using `Now.ID`.
- Deleting a `Table()`/`Record()` call is a **tracked deletion** — it generates
  a delete record that propagates to installed instances. Never remove one to
  "clean up"; ask first.

## Structure

- `src/fluent/tables/` — one file per table, kebab-case, `*.now.ts`
- `src/fluent/security/` — roles then ACLs (roles must exist first)
- `src/server/` — plain ES modules, no Glide, unit-testable
- `tests/` — `node --test`, no framework

## Design decisions worth preserving

- **The agent judges; the code computes.** `src/server/scoring.js` owns the
  weights, banding and blending. The AI agent only returns five 0–100
  sub-scores plus a confidence. This is what makes the explainability and
  fairness-audit promises (blueprint p.10/p.11) actually testable — keep it.
- **`ScoringResult` is append-only.** Re-scoring inserts a new row and flips
  `is_current`; it never updates. There is deliberately no recruiter write ACL.
- **`AuditLog` is append-only and untamperable** — its write/delete ACLs deny
  everyone with `adminOverrides: false`.
- **Candidates never see scores.** The `candidate` role is intentionally absent
  from every `x_winu_hireme_scoring_result` ACL.
- **No auto-rejection.** Blueprint p.09/p.11: nothing below threshold is sent
  without RH sign-off. Don't add a flow that does.

## Do not

- Write AI agent code before the four gate questions in
  `docs/ai-agents-brief.md` are answered by the user. The SDK guide is explicit
  that inferring them is the most common failure mode.
- Change `Application`'s parent table after the first deploy (open-questions #1).
- Handle instance credentials. `now-sdk auth` is the user's to run.

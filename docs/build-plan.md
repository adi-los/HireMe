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
| ✅ | RH Workspace — queue, candidates, job offers, scores, interview sessions, live dashboard — p.12. Deployed and verified end-to-end as an impersonated recruiter (not admin). |
| ⬜ | CV Viewer + Profile side-by-side, Copilot Panel, Action Bar (Accept/Reject/Call/Schedule/Add Note) — the workspace has the data views; these are custom UI Builder components, not generated ones |
| ⬜ | Candidate portal pages (job board, apply flow UI) — the backend API for this already exists (`hireme_portal`), only the UI Builder pages are missing |
| ⬜ | Virtual Agent topic "HireMe Assistant" |

`now-sdk explain creating-workspaces-guide` covers the workspace API — but
see the two undocumented platform requirements below before trusting it at
face value.

### RH Workspace — what's built

**URL:** `/x/winu/hireme-rh/home` — **not** `/now/{path}/{landingPath}` as the
guide's own docs claim; the real URL is scope-prefixed. Found by opening the
workspace in UI Builder (`/now/builder/ui/experience/{sys_id}`, from
`keys.ts`) and reading the "URL path" field directly, not by guessing.

- **Dashboard**: 4 live widgets (Applications Total, Awaiting Decision, Top
  Match, Category Distribution donut) reading `x_winu_hireme_application`
  and `x_winu_hireme_scoring_result` directly — no dependency on the hourly
  `KpiSnapshot` job, since a recruiter opening the workspace wants current
  state, not last hour's.
- **List menu**: 3 categories, 10 lists — Review Queue, All Applications,
  Interviewing, Decided; Candidates, Open/All Job Offers; Top Match, All
  Current Scores, Interview Sessions. Filters are the SLA-status categories
  from p.09/p.12, expressed as `condition` encoded queries.
- **Record pages**: auto-generated by the Workspace `tables:` array — full
  CRUD forms for Application/Candidate/JobOffer/ScoringResult/
  InterviewSession, no page-design work needed for these.

### Two undocumented platform requirements — found by impersonation, not guessing

Both of these looked fine in review, compiled cleanly, and matched the SDK
guide's prose — and both produced a hard access denial for a real
non-admin recruiter. Testing as admin would never have caught either one,
because `adminOverrides` on the relevant ACL bypasses admin regardless of
whether the underlying check is correct.

1. **Every workspace route needs the `canvas_user` role.** Every ServiceNow
   instance carries a standing platform-wide `*` `ux_route` ACL requiring
   `canvas_user` as a baseline for any UI Builder experience, on top of
   whatever workspace-specific ACL exists. Fixed by adding
   `containsRoles: ['canvas_user']` to `recruiterRole`/`hiringManagerRole`/
   `adminRole` in `security/roles.now.ts` — which, in hindsight, is exactly
   what the workspace-guide's own example roles do; it read as a stylistic
   choice until this exact wall was hit.

2. **`ux_route` ACL names need a `now.` prefix.** The guide's own example
   ACL uses bare `{path}.*`; the real convention, confirmed by inspecting an
   out-of-box workspace's own ACL on the instance, is `now.{path}.*`.

3. **`UxList.roles` (comma-separated string) silently does nothing.** Every
   list in the workspace showed "No lists available" to the recruiter even
   after both fixes above, despite compiling fine. Switched to
   `applicabilities` + `Applicability` records instead — the only pattern
   every one of the SDK's own real examples actually uses for this, never
   the string form. See `workspace/list-menu.now.ts`.

If you build another workspace, budget time to re-verify these three by
impersonation — nothing here is guaranteed to be a one-off quirk of this
particular lab instance.

---

## Weeks 10–11 · Quality

| | Item |
|---|---|
| ✅ | Unit tests | 31 passing — scoring, matching, profile parsing, all offline |
| ✅ | CI workflow | `.github/workflows/hireme-ci.yml` — build + tests run on every PR |
| ✅ | Backend deployed to dev | all 11 tables, 5 roles, 34 ACLs, 8 business rules, 2 REST APIs (4 routes), 2 scheduled jobs, 11 properties, 16 nav modules — every count verified against the live instance, not just the installer's own "success" message |
| ⬜ | ATF suites | `now-sdk explain atf-guide` — none written; the 31 offline tests cover the pure logic, ATF would cover the Glide-dependent pipeline/business-rule layer that can't run outside an instance |
| ✅ | Security review of ACLs on a real instance | verified 2026-09-03 by impersonating a demo recruiter (single role, not admin — admin's `adminOverrides:true` on most ACLs would have hidden a broken role check). Confirmed: reads Applications/Candidates/JobOffers/ScoringResults correctly, correctly **blocked** from AuditLog. See the finding below. |
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

## Note on `Record()` and role grants — a real bug this caught

Impersonating the demo recruiter (`src/fluent/demo/demo-users.now.ts`) first
showed every role-gated page as "Security constraints prevent access" —
Candidate, CVDocument, etc. — while `Application` worked. That split was the
clue: `Application` has a role-*independent* public read ACL (the
token-gated status endpoint's ACL, `access_tokenISNOTEMPTY`), so it never
actually exercised the recruiter role at all.

Root cause: `sys_user_has_role.state` was empty string on every demo role
grant. `Record()` does not populate platform defaults (documented SDK
behavior — see the `record-api` topic), and a normal role grant made through
the UI sets `state: 'active'` automatically; ours didn't. An empty `state`
inserts the row fine but the platform never resolves it into the session's
role set — confirmed directly via `window.g_user.hasRole(...)` returning
`false` for a role the database plainly showed the user had.

Fixed in source (`state: 'active'` added to all three demo role Record()
calls) and on the instance (same fix, applied by hand to the 3 existing
rows rather than a full reinstall). **If you add more demo `sys_user_has_role`
rows, set `state: 'active'` explicitly — it will not default correctly.**

After the fix, impersonation confirmed the ACL design is correct: the
recruiter reads Application/Candidate/JobOffer/ScoringResult (including the
reference fields, which had also been rendering blank for the same reason)
and is cleanly denied AuditLog.

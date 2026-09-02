# HireMe Blueprint — verbatim source text

> Extracted from `HireMe_ServiceNow_SDK_Blueprint.pdf` (18 pages, v1.0, September 2026).
> This is the unedited source of truth. Interpretation and gaps live in `open-questions.md`.

```text

===== PAGE 1 =====
S E R V I C E N O W  A I  P L A T F O R M   ·   B U I L T  W I T H  @ S E R V I C E N O W / S D K
HireMe
AI-Powered Recruitment Platform — From CV to Hire
A complete architecture & build blueprint: candidate onboarding, CV
upload & OCR, AI scoring & categorization, recruiter copilot chatbot, AI-
assisted first interview, and full governance — designed, built and
deployed end-to-end on the Now Platform using pro-code Fluent
development.
Scoped App · x_winu_hireme
 
ServiceNow SDK (Fluent)
 
AI Agent Scoring
 
Virtual Agent Copilot
H I R E M E  ·  A R C H I T E C T U R E  &  D E P L O Y M E N T  B L U E P R I N T
V E R S I O N  1 . 0  ·  S E P T E M B E R  2 0 2 6

===== PAGE 2 =====
C O N T E N T S
What's Inside
01 · Vision & Executive Summary
03
02 · High-Level Architecture
04
03 · End-to-End Recruitment Flow
05
04 · Process Walkthrough (Step by Step)
06
05 · Data Model Overview
07
06 · Data Model Specifications
08
07 · Scoring System & Categorization
09
08 · KPIs & Analytics
10
09 · Governance, Rules & Compliance
11
10 · RH Workspace
12
11 · Candidate Experience
13
12 · AI Interview Module
14
13 · Build Plan I — Foundations
15
14 · Build Plan II — AI, UX & Testing
16
15 · CI/CD & Deployment Pipeline
17
16 · Roadmap & Closing
18
H I R E M E
T A B L E  O F  C O N T E N T S

===== PAGE 3 =====
0 1  ·  V I S I O N
Executive Summary
HireMe turns recruitment into a governed, AI-assisted pipeline built entirely on the ServiceNow AI Platform. A
candidate uploads a CV once; from that moment, OCR extraction, structured profiling, AI scoring, categorization,
and — when needed — an AI-led first interview all happen automatically. Recruiters never lose control: every AI
output is explainable, logged, and reviewed by a human before any final decision is made.
INTAKE
Zero-Touch Intake & OCR
Candidates apply through a public portal. CVs (PDF/DOCX/scanned) are
parsed automatically via OCR and normalized into structured profiles — no
manual data entry.
AI
Explainable AI Scoring
Each application is scored against the job's requirements using a weighted,
multi-criteria model with a visible breakdown — never a black box.
COPILOT
RH Copilot Chatbot
Recruiters can ask natural-language questions about any candidate —
"does she have Kubernetes experience?" — grounded directly in the
candidate's real data.
INTERVIEW
AI-Assisted First Interview
A lightweight, conversational AI interview pre-screens strong candidates
with dynamically generated questions — always reviewed by a human
before any decision.
H I R E M E
E X E C U T I V E  S U M M A R Y

===== PAGE 4 =====
0 2  ·  A R C H I T E C T U R E
High-Level Architecture
Everything lives inside one governed scoped application, orchestrated by Flow Designer, with AI capability provided
through Fluent AI Agents and external OCR/LLM services accessed via Scripted REST / Integration Hub.
Platform Governance — ACL Roles · Source Control (Git) · ATF Tests · DevOps Pipeline
Candidate Portal
UI Builder · Public
RH Workspace
UI Builder · Internal
HireMe Scoped App — x_winu_hireme
Tables & ACLs
Flow Designer
Virtual Agent Topic
AI Agent (Fluent)
Scoring Engine · Categorization · Audit Log
Weighted multi-criteria model with explainability breakdown
OCR Service
Document Intelligence
LLM Provider
Scoring · Chat · Interview
Notifications — Email · Push · Slack/Teams
REST
Integration Hub
Why one scoped app
Keeps tables, ACLs, flows, AI agents, and UI pages versioned and deployed
together as a single governed unit — no metadata drift between
environments.
Why external AI/OCR
OCR and LLM scoring are called through Scripted REST / Integration Hub so
provider choice (Now Assist, Azure Document Intelligence, or any LLM API)
can change without touching the core data model.
H I R E M E
H I G H - L E V E L  A R C H I T E C T U R E

===== PAGE 5 =====
0 3  ·  P R O C E S S
End-to-End Recruitment Flow
1 · Candidate Applies — Form + CV Upload
2a · Application Created
2b · CVDocument Attached
3 · OCR Extraction Flow (async)
4 · Structured CandidateProfile Saved
5 · AI Analysis & Scoring (AI Agent vs Job Offer)
6 · ScoringResult + Category Assigned
7 · RH Review Queue
Filter by category · Ask HireMe Copilot about the candidate
8a · Reject
8b · Call for Screening
8c · Send to AI Interview
Notify Candidate · Closed
Manual Phone Screening Task
AI Interview Session
Q&A + Sub-score + Transcript
9 · RH Final Decision
Accept / Reject — always human, fully audited
10 · Notify Candidate + Update KPIs
H I R E M E
E N D - T O - E N D  F L O W

===== PAGE 6 =====
0 4  ·  P R O C E S S  D E T A I L
Step-by-Step Walkthrough
1
Candidate Applies
Public portal form collects identity, consent, and CV (PDF/DOCX/image). A soft-apply
"I'm interested" option is also available for candidates browsing without applying
yet.
2
Records Created
An Application record is created (status: Received) linked to Candidate and
JobOffer; the uploaded file becomes a CVDocument record.
3
OCR Extraction
An async Flow calls the OCR service (Scripted REST + webhook callback) to extract
raw text, even from scanned CVs, and stores it against the CVDocument.
4
Structured Profiling
Raw OCR text is normalized into a CandidateProfile — skills, experience years,
education, past roles — using rule-based parsing plus an LLM extraction pass for
edge cases.
5
AI Scoring
The Scoring AI Agent compares the profile against the JobOffer's requirements and
produces a weighted score with a full criteria breakdown (see Scoring System, page
09).
6
Categorization
The score maps to a category — Top Match, Strong Fit, Potential, Not a Fit — stored
on ScoringResult and visible instantly in the RH queue.
7
RH Review
Recruiters browse the categorized queue, open a candidate, read the CV side-by-
side with the parsed profile, and can ask the HireMe Copilot chatbot free-form
questions about that candidate.
8
Decision Branch
The recruiter chooses Reject (candidate notified, application closed), Call (a
manual screening task is created), or Send to AI Interview (see page 14).
9
Final Decision
Whether via phone screening or AI interview, the recruiter records the final
Accept/Reject decision. Every action is written to AuditLog with actor, timestamp,
and reason.
10
Notify & Learn
The candidate is notified automatically (email/portal), the Application status is
updated, and KPI counters (time-to-screen, conversion rate, etc.) refresh in real
time.
H I R E M E
P R O C E S S  W A L K T H R O U G H

===== PAGE 7 =====
0 5  ·  D A T A  M O D E L
Data Model Overview
Candidate
name · email · consent_date
JobOffer
title · requirements · status
Application
candidate_ref · joboffer_ref · status
CVDocument
file · ocr_status · raw_text
CandidateProfile
skills · experience_years · education
ScoringResult
score · category · breakdown_json
InterviewSession
transcript · ai_subscore · status
ChatInteraction
actor · message · timestamp
Notification
channel · status · sent_date
AuditLog
actor · action · timestamp
Solid lines = core relations · Dashed lines = supporting/audit tables, all keyed off Application
H I R E M E
D A T A  M O D E L  O V E R V I E W

===== PAGE 8 =====
0 6  ·  D A T A  M O D E L
Table Specifications
Core fields for the four tables that carry the most business logic. Remaining tables (CVDocument, ChatInteraction,
Notification, AuditLog) follow the same pattern: a reference to Application, an owning-record ACL, and immutable
audit fields.
x_winu_hireme_candidate
FIELD
TYPE
DESCRIPTION
full_name
String(100)
Candidate's full legal name
email / phone
Email / String
Primary contact details
source
Choice
portal · referral · agency · career-fair
consent_given_at
GlideDateTime
GDPR-style consent timestamp, required to apply
x_winu_hireme_application
FIELD
TYPE
DESCRIPTION
candidate_ref / joboffer_ref
Reference
Links to Candidate and JobOffer
status
Choice
Received · Screened · Interviewing · Decided · Closed
applied_date
GlideDateTime
When the application was submitted
final_decision
Choice
Accepted · Rejected · Withdrawn (set by RH only)
x_winu_hireme_scoring_result
FIELD
TYPE
DESCRIPTION
application_ref
Reference
Parent Application
score
Integer (0-100)
Final weighted score
category
Choice
Top Match · Strong Fit · Potential · Not a Fit
breakdown_json
JSON
Per-criterion sub-scores for explainability
model_version
String
AI Agent / prompt version used, for audit
x_winu_hireme_interview_session
FIELD
TYPE
DESCRIPTION
application_ref
Reference
Parent Application
status
Choice
Invited · In Progress · Completed · Reviewed
transcript
JSON
Full Q&A transcript
ai_subscore
Integer (0-100)
Interview-only sub-score, blended into final score
H I R E M E
D A T A  M O D E L  S P E C I F I C A T I O N S

===== PAGE 9 =====
0 7  ·  S C O R I N G
Scoring System & Categorization
A transparent, weighted multi-criteria model. Every score ships with its breakdown — recruiters always see why a
candidate scored the way they did.
// Weighted scoring formula
score = 0.40 * skills_match
    + 0.25 * experience_relevance
    + 0.10 * education_fit
    + 0.10 * soft_skills_signal
    + 0.05 * logistics_fit
    - 0.10 * (1 - data_confidence) // penalty
Illustrative distribution across an open requisition
Top Match (85-100)
12%
Strong Fit (70-84)
28%
Potential (50-69)
35%
Not a Fit (<50)
25%
CATEGORY
SCORE
RECOMMENDED RH ACTION
SLA
Top Match
85-100
Direct interview invite
24h review
Strong Fit
70-84
Phone screen or AI interview
48h review
Potential
50-69
Manual review, keep warm
72h review
Not a Fit
<50
Polite rejection — never auto-sent below threshold without RH sign-off
5 business days
H I R E M E
S C O R I N G  S Y S T E M

===== PAGE 10 =====
0 8  ·  A N A L Y T I C S
KPIs & Dashboard
A live KPI panel sits inside the RH Workspace, backed by scheduled Flow aggregations into reporting tables — no
manual spreadsheets.
4.2h
Avg. Time-to-Screen
97%
OCR Success Rate
88%
RH SLA Compliance
31%
Offer Conversion Rate
18d
Avg. Time-to-Hire
76%
AI Interview Completion
64%
Copilot Resolution Rate
0.03
Score Variance (Fairness Audit)
How KPIs are computed
A scheduled Flow runs hourly, aggregating Application, ScoringResult and InterviewSession records into a reporting table. Fairness Audit compares score
distributions across anonymized cohorts to catch systemic bias early — reviewed monthly by the HireMe governance owner.
H I R E M E
K P I S  &  A N A L Y T I C S

===== PAGE 11 =====
0 9  ·  G O V E R N A N C E
Rules & Compliance
ROLE
CAN
Candidate
View & edit own application only; no visibility on score or other candidates
Recruiter
View/manage applications for their assigned requisitions; run copilot queries; make decisions
Hiring Manager
Read-only on shortlisted candidates for their open roles; comment, not decide
HireMe Admin
Configure scoring weights, categories, ACLs, and AI Agent prompts (versioned)
Data & Privacy
Explicit consent captured at apply time · CVs encrypted at rest · 24-month
retention post-decision, then auto-anonymized · candidates can request
deletion at any time, logged in AuditLog.
AI Governance
AI scores are advisory only — a human always makes the final call · every
score shows its breakdown · model version & prompt are logged per event ·
no auto-rejection below threshold without RH sign-off.
Process SLAs
OCR extraction: <15 min · First RH review after categorization: <48h ·
Candidate notified of final decision: within 5 business days.
Change Management
Any change to scoring weights requires peer review, a version bump on the
AI Agent, and a passing ATF regression suite before promotion to
production.
H I R E M E
G O V E R N A N C E  &  C O M P L I A N C E

===== PAGE 12 =====
1 0  ·  E X P E R I E N C E
RH Workspace
A single UI Builder workspace gives recruiters everything they need without leaving the record.
Candidate Queue
Categorized list view with color-coded chips, saved filters by requisition,
recruiter, or SLA status.
CV Viewer + Profile
Inline document preview next to the parsed structured profile — skills,
experience, education — side by side.
HireMe Copilot Panel
Ask natural-language questions grounded in that candidate's real records:
"Does she have Kubernetes experience?" — answers cite the source field.
Action Bar
Accept · Reject · Call · Schedule AI Interview · Add Note — every action fires
a Flow and writes to AuditLog automatically.
H I R E M E
R H  W O R K S P A C E

===== PAGE 13 =====
1 1  ·  E X P E R I E N C E
Candidate Experience
Public Job Board
Browse and search open JobOffers, filter by department/location, no login
required to browse.
Apply Flow
Short form + drag-and-drop CV upload + explicit consent checkbox. OCR
kicks off automatically on submit.
"I'm Interested"
Soft-apply option: candidates follow a role or the company for future
openings without a full application.
My Applications
Status timeline — Received → Screening → Interview → Decision — plus a
chat widget to ask "what's the status of my application?" via the Virtual
Agent topic.
H I R E M E
C A N D I D A T E  E X P E R I E N C E

===== PAGE 14 =====
1 2  ·  A I  I N T E R V I E W
AI Interview Module
A deliberately simple, chat-based first-round interview — no video, no voice complexity — that pre-screens strong
candidates while keeping the recruiter fully in control of the final call.
Invited
  →  
In Progress
  →  
Completed
  →  
Reviewed by RH
Trigger
Recruiter clicks "Send to AI Interview", or auto-trigger when Category = Top
Match and the JobOffer has auto-interview enabled.
Question Generation
5-8 questions dynamically generated by the Interview AI Agent from the job
description and any gaps found in the candidate's CV.
Evaluation
Each answer is scored against a rubric (clarity, relevance, depth), producing
a 0-100 sub-score plus flags such as "clarify employment gap 2022-2023".
Score Blending
final_score = 0.7 * original_score + 0.3 * interview_subscore — only
applied once the interview is completed; otherwise the original AI score
stands.
Human-in-the-loop, always
The recruiter reviews the full transcript before recording any final decision — the AI interview informs, it never decides.
H I R E M E
A I  I N T E R V I E W  M O D U L E

===== PAGE 15 =====
1 3  ·  B U I L D  P L A N  —  P A R T  I
Foundations with @servicenow/sdk
0
Environment Setup
Node.js 20+, install the SDK, authenticate against your PDI or dev instance, scaffold the project.
# install & auth
npm install -g @servicenow/sdk
now-sdk auth login --url https://<your-instance>.service-now.com
# scaffold
now-sdk init hireme --scope x_winu_hireme
cd hireme && git init && git remote add origin <repo-url>
1
Data Model & Security (Fluent)
Define all 10 tables as Fluent Table() objects, plus roles and ACLs matching the governance matrix (page 11).
// fluent/src/tables/candidate.now.ts
import { Table, Column } from '@servicenow/sdk/core';
export const Candidate = Table({
  name: 'x_winu_hireme_candidate',
  label: 'Candidate',
  columns: {
    full_name: Column.String({ label: 'Full Name', maxLength: 100 }),
    email: Column.Email({ label: 'Email' }),
    source: Column.Choice({ label: 'Source', choices: ['portal','referral','agency'] }),
    consent_given_at: Column.GlideDateTime({ label: 'Consent Date' }),
  }
});
now-sdk build && now-sdk deploy --env dev
2
Core Orchestration (Flow Designer)
Flows for: Application create → status Received; OCR webhook callback → parse profile; profile ready → call scoring AI Agent → save ScoringResult → set category → update
status Screened.
H I R E M E
B U I L D  P L A N  —  F O U N D A T I O N S

===== PAGE 16 =====
1 4  ·  B U I L D  P L A N  —  P A R T  I I
AI, Experience & Testing
3
AI Layer (Fluent AiAgent)
Scoring Agent (JobOffer + CandidateProfile → JSON score/category/breakdown), Interview Agent (question generation + answer evaluation), and the Copilot Skill grounded on
Application-related records.
// fluent/src/ai/scoring-agent.now.ts
export const ScoringAgent = AiAgent({
  name: 'hireme_scoring_agent',
  instructions: 'Score the candidate profile against the job requirements...',
  inputs: { profile: 'json_object', requirements: 'json_object' },
  outputs: { score: 'numeric', category: 'string', breakdown: 'json_object' }
});
4
Experience Layer
UI Builder pages for RH Workspace & Candidate Portal; a Virtual Agent Topic "HireMe Assistant" for candidate status queries and RH copilot questions.
5
Quality, CI/CD & Deployment
ATF suites per flow and scoring boundary; feature branches with required checks; GitHub Actions builds and runs ATF on every PR; promotion gates from Dev → Test/UAT →
Prod via the DevOps app and Change Requests.
# .github/workflows/hireme-ci.yml (excerpt)
- run: now-sdk build
- run: now-sdk deploy --env dev
- run: now-sdk atf run --suite hireme-regression
# on merge to main, promotion is gated by Change Management
H I R E M E
B U I L D  P L A N  —  A I ,  U X  &  T E S T I N G

===== PAGE 17 =====
1 5  ·  D E P L O Y M E N T
CI/CD & Deployment Pipeline
Local Dev
VS Code + Fluent
now-sdk build
Git Repository
feature branch + PR
git push
CI Pipeline
GitHub Actions
lint · build · ATF
Dev Instance
auto-deploy
now-sdk deploy --env dev
Test / UAT
manual promotion
+ approval gate
Production
Change Request
+ scheduled window
Every promotion gate requires: ATF suite green · peer-reviewed PR · Change Request approved for Prod
Rollback via versioned Application Repository snapshots · scoring weights are feature-flagged, no redeploy needed
H I R E M E
C I / C D  &  D E P L O Y M E N T

===== PAGE 18 =====
1 6  ·  R O A D M A P
Milestones & Next Steps
WEEKS
PHASE
DELIVERABLES
1-2
Foundations
Environment, data model, roles & ACLs deployed to dev
3-4
Core Flows
Application intake, OCR integration, profile parsing
5-6
AI Layer
Scoring Agent, Copilot Skill, Interview Agent
7-9
Experience
RH Workspace, Candidate Portal, Virtual Agent topic
10-11
Quality
ATF suites, CI/CD pipeline, security review
12
Go-Live
UAT sign-off, Change Request, production launch
HireMe — From Résumé to Hire, Fully Orchestrated
A governed, explainable, AI-assisted recruitment pipeline — built entirely with pro-code Fluent development on the ServiceNow AI Platform, deployable
through the same Git-based CI/CD discipline as any modern application.
H I R E M E
R O A D M A P  &  C L O S I N G
```

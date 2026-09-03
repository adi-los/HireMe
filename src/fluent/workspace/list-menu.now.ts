import '@servicenow/sdk/global'
import { UxListMenuConfig, Applicability } from '@servicenow/sdk/core'
import { recruiterRole, hiringManagerRole, adminRole } from '../security/roles.now'

/**
 * Navigation + list views for the RH Workspace (blueprint p.12).
 *
 * "Candidate Queue — categorized list view with color-coded chips, saved
 * filters by requisition, recruiter, or SLA status."
 *
 * Filters are expressed as conditions here rather than "saved filters" a
 * recruiter builds themselves — the categories below (Review Queue,
 * Interviewing, Decided) ARE the SLA-status filters the blueprint describes.
 * A recruiter can still filter further within any list.
 *
 * Role gating uses `applicabilities` (Applicability records), NOT the
 * simpler `roles: 'comma,separated,string'` property UxList also accepts.
 * The string form looked equally valid from the docs and compiled cleanly,
 * but under an impersonated recruiter it produced "No lists available. You
 * can request list access from your admin." for every single list — the
 * same class of problem as the workspace route ACL below: `roles` on
 * ux_route ACLs and `roles` on UxList are both there in the type system,
 * both compile, and neither actually gates workspace UI to a non-admin
 * role-holder on this platform version. `Applicability` is the pattern
 * every one of the SDK's own real examples uses — never the string form —
 * which in hindsight was the tell.
 */

const allRolesApplicability = Applicability({
    $id: Now.ID['hireme_applicability_all_roles'],
    name: 'HireMe All Internal Roles',
    description: 'Recruiter, hiring manager and admin.',
    roles: [recruiterRole, hiringManagerRole, adminRole],
})

const recruiterAdminApplicability = Applicability({
    $id: Now.ID['hireme_applicability_recruiter_admin'],
    name: 'HireMe Recruiter and Admin',
    description: 'Recruiter and admin only — excludes hiring manager.',
    roles: [recruiterRole, adminRole],
})

export const hiremeListConfig = UxListMenuConfig({
    $id: Now.ID['hireme_list_config'],
    name: 'HireMe RH Workspace Lists',
    description: 'Candidate queue, candidates, job offers, scores and interviews.',
    categories: [
        {
            $id: Now.ID['category_applications'],
            title: 'Applications',
            order: 100,
            lists: [
                {
                    $id: Now.ID['list_review_queue'],
                    title: 'Review Queue',
                    table: 'x_winu_hireme_application',
                    order: 100,
                    // Scored (past intake) but not yet decided — the p.05
                    // step 7 queue.
                    condition: 'statusINscreened,interviewing^final_decisionISEMPTY',
                    columns: 'number,candidate_ref,joboffer_ref,status,applied_date',
                    applicabilities: [{ $id: Now.ID['applicability_review_queue'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_all_applications'],
                    title: 'All Applications',
                    table: 'x_winu_hireme_application',
                    order: 200,
                    condition: '',
                    columns: 'number,candidate_ref,joboffer_ref,status,final_decision,applied_date',
                    applicabilities: [{ $id: Now.ID['applicability_all_applications'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_interviewing'],
                    title: 'Interviewing',
                    table: 'x_winu_hireme_application',
                    order: 300,
                    condition: 'status=interviewing',
                    columns: 'number,candidate_ref,joboffer_ref,applied_date',
                    applicabilities: [{ $id: Now.ID['applicability_interviewing'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_decided'],
                    title: 'Decided',
                    table: 'x_winu_hireme_application',
                    order: 400,
                    condition: 'statusINdecided,closed',
                    columns: 'number,candidate_ref,joboffer_ref,final_decision,applied_date',
                    applicabilities: [{ $id: Now.ID['applicability_decided'], applicability: allRolesApplicability }],
                },
            ],
        },
        {
            $id: Now.ID['category_candidates_offers'],
            title: 'Candidates & Offers',
            order: 200,
            lists: [
                {
                    $id: Now.ID['list_candidates'],
                    title: 'Candidates',
                    table: 'x_winu_hireme_candidate',
                    order: 100,
                    condition: '',
                    columns: 'full_name,email,phone,source,consent_given_at',
                    applicabilities: [{ $id: Now.ID['applicability_candidates'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_job_offers_open'],
                    title: 'Open Job Offers',
                    table: 'x_winu_hireme_job_offer',
                    order: 200,
                    condition: 'status=open',
                    columns: 'title,department,location,status',
                    applicabilities: [{ $id: Now.ID['applicability_job_offers_open'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_job_offers_all'],
                    title: 'All Job Offers',
                    table: 'x_winu_hireme_job_offer',
                    order: 300,
                    condition: '',
                    columns: 'title,department,location,status',
                    applicabilities: [{ $id: Now.ID['applicability_job_offers_all'], applicability: recruiterAdminApplicability }],
                },
            ],
        },
        {
            $id: Now.ID['category_ai_outputs'],
            title: 'AI Outputs',
            order: 300,
            lists: [
                {
                    $id: Now.ID['list_scoring_top_match'],
                    title: 'Top Match',
                    table: 'x_winu_hireme_scoring_result',
                    order: 100,
                    condition: 'category=top_match^is_current=true',
                    columns: 'application_ref,score,category,scored_at',
                    applicabilities: [{ $id: Now.ID['applicability_scoring_top_match'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_scoring_current'],
                    title: 'All Current Scores',
                    table: 'x_winu_hireme_scoring_result',
                    order: 200,
                    condition: 'is_current=true',
                    columns: 'application_ref,score,category,model_version,scored_at',
                    applicabilities: [{ $id: Now.ID['applicability_scoring_current'], applicability: allRolesApplicability }],
                },
                {
                    $id: Now.ID['list_interview_sessions'],
                    title: 'Interview Sessions',
                    table: 'x_winu_hireme_interview_session',
                    order: 300,
                    condition: '',
                    columns: 'application_ref,status,ai_subscore,completed_at',
                    applicabilities: [{ $id: Now.ID['applicability_interview_sessions'], applicability: allRolesApplicability }],
                },
            ],
        },
    ],
})

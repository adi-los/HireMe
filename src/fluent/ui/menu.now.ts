import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

/**
 * Navigator entry for HireMe.
 *
 * Without this the app has no front door at all — the tables exist but are
 * only reachable from Studio or by typing list URLs by hand.
 *
 * This is the classic navigator. The UI Builder workspace (blueprint p.12)
 * replaces it for day-to-day recruiter work; this stays useful for admins
 * and for testing ACLs by impersonation.
 */

const RECRUITER = 'x_winu_hireme.recruiter'
const MANAGER = 'x_winu_hireme.hiring_manager'
const ADMIN = 'x_winu_hireme.admin'

export const hiremeMenu = ApplicationMenu({
    $id: Now.ID['menu_hireme'],
    title: 'HireMe',
    hint: 'AI-assisted recruitment pipeline',
    description: 'Candidate intake, CV extraction, AI scoring and interview management.',
    roles: [RECRUITER, MANAGER, ADMIN],
    active: true,
})

/* ---------------- Recruiter day-to-day ---------------- */

Record({
    $id: Now.ID['module_applications'],
    table: 'sys_app_module',
    data: {
        title: 'Applications',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_application',
        hint: 'All applications',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 100,
    },
})

Record({
    $id: Now.ID['module_review_queue'],
    table: 'sys_app_module',
    data: {
        title: 'Review Queue',
        application: hiremeMenu,
        link_type: 'FILTER',
        name: 'x_winu_hireme_application',
        // Everything scored but not yet decided (blueprint p.05 step 7).
        filter: 'statusINreceived,screened^final_decisionISEMPTY',
        hint: 'Scored, awaiting recruiter review',
        roles: [RECRUITER, ADMIN],
        active: true,
        order: 200,
    },
})

Record({
    $id: Now.ID['module_candidates'],
    table: 'sys_app_module',
    data: {
        title: 'Candidates',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_candidate',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 300,
    },
})

Record({
    $id: Now.ID['module_job_offers'],
    table: 'sys_app_module',
    data: {
        title: 'Job Offers',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_job_offer',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 400,
    },
})

Record({
    $id: Now.ID['module_job_offer_new'],
    table: 'sys_app_module',
    data: {
        title: 'New Job Offer',
        application: hiremeMenu,
        link_type: 'NEW',
        name: 'x_winu_hireme_job_offer',
        roles: [RECRUITER, ADMIN],
        active: true,
        order: 500,
    },
})

/* ---------------- AI outputs ---------------- */

Record({
    $id: Now.ID['module_sep_ai'],
    table: 'sys_app_module',
    data: {
        title: 'AI Outputs',
        application: hiremeMenu,
        link_type: 'SEPARATOR',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 600,
    },
})

Record({
    $id: Now.ID['module_scoring_results'],
    table: 'sys_app_module',
    data: {
        title: 'Scoring Results',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_scoring_result',
        hint: 'Scores with explainability breakdown',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 700,
    },
})

Record({
    $id: Now.ID['module_interviews'],
    table: 'sys_app_module',
    data: {
        title: 'Interview Sessions',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_interview_session',
        roles: [RECRUITER, MANAGER, ADMIN],
        active: true,
        order: 800,
    },
})

Record({
    $id: Now.ID['module_profiles'],
    table: 'sys_app_module',
    data: {
        title: 'Candidate Profiles',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_candidate_profile',
        hint: 'Structured data parsed from CVs',
        roles: [RECRUITER, ADMIN],
        active: true,
        order: 900,
    },
})

Record({
    $id: Now.ID['module_cv_documents'],
    table: 'sys_app_module',
    data: {
        title: 'CV Documents',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_cv_document',
        roles: [RECRUITER, ADMIN],
        active: true,
        order: 1000,
    },
})

Record({
    $id: Now.ID['module_ocr_failures'],
    table: 'sys_app_module',
    data: {
        title: 'OCR Failures',
        application: hiremeMenu,
        link_type: 'FILTER',
        name: 'x_winu_hireme_cv_document',
        filter: 'ocr_status=failed',
        hint: 'Extractions needing attention',
        roles: [ADMIN],
        active: true,
        order: 1100,
    },
})

/* ---------------- Administration ---------------- */

Record({
    $id: Now.ID['module_sep_admin'],
    table: 'sys_app_module',
    data: {
        title: 'Administration',
        application: hiremeMenu,
        link_type: 'SEPARATOR',
        roles: [ADMIN],
        active: true,
        order: 1200,
    },
})

Record({
    $id: Now.ID['module_kpi'],
    table: 'sys_app_module',
    data: {
        title: 'KPI Snapshots',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_kpi_snapshot',
        hint: 'Hourly aggregations behind the dashboard',
        roles: [ADMIN],
        active: true,
        order: 1300,
    },
})

Record({
    $id: Now.ID['module_notifications'],
    table: 'sys_app_module',
    data: {
        title: 'Notifications',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_notification',
        roles: [ADMIN],
        active: true,
        order: 1400,
    },
})

Record({
    $id: Now.ID['module_chat'],
    table: 'sys_app_module',
    data: {
        title: 'Chat Interactions',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_chat_interaction',
        roles: [ADMIN],
        active: true,
        order: 1500,
    },
})

Record({
    $id: Now.ID['module_audit_log'],
    table: 'sys_app_module',
    data: {
        title: 'Audit Log',
        application: hiremeMenu,
        link_type: 'LIST',
        name: 'x_winu_hireme_audit_log',
        hint: 'Append-only. Every decision and AI output.',
        roles: [ADMIN],
        active: true,
        order: 1600,
    },
})

import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * Demo pipeline data — one strong match, one weak one — so the recruiter
 * queue has something real to click through instead of an empty list.
 *
 * `installMethod: 'demo'` keeps this out of a production install. The
 * end-state (profile, score, category) is set directly rather than relying
 * on the business-rule cascade (CVDocument insert -> parse -> score) firing
 * in a predictable order during app install — demo data should be a
 * deterministic snapshot, not a live simulation of the pipeline.
 */

const demoJobOffer = Record({
    $id: Now.ID['demo_job_offer_platform_eng'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_job_offer',
    data: {
        title: 'Senior Platform Engineer',
        department: 'Engineering',
        location: 'Casablanca',
        description: 'Own our Kubernetes platform and CI/CD tooling across three product teams.',
        requirements: JSON.stringify({
            skills: [
                { name: 'kubernetes', weight: 3 },
                { name: 'aws', weight: 2 },
                { name: 'terraform', weight: 1 },
            ],
            min_experience_years: 5,
            min_education_level: 3,
            soft_skills: ['leadership'],
            location: 'Casablanca',
            remote_allowed: false,
        }),
        status: 'open',
        auto_interview_enabled: false,
    },
})

/* ---------------- Strong match ---------------- */

const strongCandidate = Record({
    $id: Now.ID['demo_candidate_strong'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_candidate',
    data: {
        full_name: 'Amina Benali',
        // Matches the demo_user_candidate sys_user in demo-users.now.ts, so
        // impersonating that user demonstrates the candidate-ownership ACL.
        email: 'demo.candidate@example.invalid',
        phone: '+212 6 12 34 56 78',
        source: 'portal',
        consent_given_at: '2026-08-15 09:00:00',
    },
})

const strongApplication = Record({
    $id: Now.ID['demo_application_strong'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_application',
    data: {
        candidate_ref: strongCandidate,
        joboffer_ref: demoJobOffer,
        status: 'screened',
        applied_date: '2026-08-15 09:05:00',
        access_token: 'demo0000000000000000000000strong',
    },
})

Record({
    $id: Now.ID['demo_cv_strong'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_cv_document',
    data: {
        application_ref: strongApplication,
        file_name: 'amina-benali-cv.pdf',
        mime_type: 'application/pdf',
        ocr_status: 'complete',
        raw_text: 'Lead Platform Engineer with 8+ years running Kubernetes on AWS, Terraform, leadership of a 4-person SRE team.',
        ocr_completed_at: '2026-08-15 09:06:00',
    },
})

Record({
    $id: Now.ID['demo_profile_strong'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_candidate_profile',
    data: {
        application_ref: strongApplication,
        skills: JSON.stringify(['kubernetes', 'aws', 'terraform', 'ci/cd']),
        experience_years: 8,
        education: 'Master',
        past_roles: JSON.stringify(['leadership', 'mentoring']),
        data_confidence: 0.95,
        parser_version: 'rules-v1',
    },
})

Record({
    $id: Now.ID['demo_scoring_strong'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_scoring_result',
    data: {
        application_ref: strongApplication,
        score: 90,
        category: 'top_match',
        breakdown_json: JSON.stringify({
            criteria: {
                skills_match: { value: 100, weight: 0.4, contribution: 40 },
                experience_relevance: { value: 100, weight: 0.25, contribution: 25 },
                education_fit: { value: 100, weight: 0.1, contribution: 10 },
                soft_skills_signal: { value: 100, weight: 0.1, contribution: 10 },
                logistics_fit: { value: 100, weight: 0.05, contribution: 5 },
            },
            data_confidence: 0.95,
            penalty: 0.5,
            model_version: 'demo-seed',
        }),
        model_version: 'demo-seed',
        scored_at: '2026-08-15 09:07:00',
        is_current: 'true',
    },
})

/* ---------------- Weak match ---------------- */

const weakCandidate = Record({
    $id: Now.ID['demo_candidate_weak'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_candidate',
    data: {
        full_name: 'Karim Idrissi',
        email: 'demo.candidate.weak@example.invalid',
        phone: '+212 6 98 76 54 32',
        source: 'career_fair',
        consent_given_at: '2026-08-20 14:00:00',
    },
})

const weakApplication = Record({
    $id: Now.ID['demo_application_weak'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_application',
    data: {
        candidate_ref: weakCandidate,
        joboffer_ref: demoJobOffer,
        status: 'screened',
        applied_date: '2026-08-20 14:05:00',
        access_token: 'demo00000000000000000000000weak',
    },
})

Record({
    $id: Now.ID['demo_cv_weak'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_cv_document',
    data: {
        application_ref: weakApplication,
        file_name: 'karim-idrissi-cv.pdf',
        mime_type: 'application/pdf',
        ocr_status: 'complete',
        raw_text: 'Recent graduate, internship experience with basic web development in JavaScript.',
        ocr_completed_at: '2026-08-20 14:06:00',
    },
})

Record({
    $id: Now.ID['demo_profile_weak'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_candidate_profile',
    data: {
        application_ref: weakApplication,
        skills: JSON.stringify(['javascript']),
        experience_years: 0,
        education: 'Bachelor',
        past_roles: JSON.stringify([]),
        data_confidence: 0.6,
        parser_version: 'rules-v1',
    },
})

Record({
    $id: Now.ID['demo_scoring_weak'],
    $meta: { installMethod: 'demo' },
    table: 'x_winu_hireme_scoring_result',
    data: {
        application_ref: weakApplication,
        score: 22,
        category: 'not_a_fit',
        breakdown_json: JSON.stringify({
            criteria: {
                skills_match: { value: 17, weight: 0.4, contribution: 6.7 },
                experience_relevance: { value: 0, weight: 0.25, contribution: 0 },
                education_fit: { value: 100, weight: 0.1, contribution: 10 },
                soft_skills_signal: { value: 0, weight: 0.1, contribution: 0 },
                logistics_fit: { value: 50, weight: 0.05, contribution: 2.5 },
            },
            data_confidence: 0.6,
            penalty: 4,
            model_version: 'demo-seed',
        }),
        model_version: 'demo-seed',
        scored_at: '2026-08-20 14:07:00',
        is_current: 'true',
    },
})

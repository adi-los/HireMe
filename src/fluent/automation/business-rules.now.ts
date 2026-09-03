import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { applicationDefaults } from '../../server/business-rules/application-defaults'
import { auditApplicationCreated, auditApplicationDecision } from '../../server/business-rules/audit-application'
import { requestOcrOnInsert, onOcrStatusChange } from '../../server/business-rules/cv-document'
import { onInterviewStatusChange, stampInvitedAt } from '../../server/business-rules/interview-session'
import { onScoringResultInsert } from '../../server/business-rules/scoring-result'

/**
 * Business rules wiring the pipeline together. Each script lives in
 * `src/server/business-rules/` — this file is purely the trigger definition.
 *
 * Two-rule pattern for status transitions (CVDocument, InterviewSession): the
 * script itself compares `current` vs `previous` to detect the transition,
 * rather than relying on filterCondition's "changes" support, which is not
 * guaranteed to compose the way this needs across ServiceNow versions.
 */

/* ---------------- Application ---------------- */

BusinessRule({
    $id: Now.ID['br_application_defaults'],
    name: 'HireMe - Application Defaults',
    table: 'x_winu_hireme_application',
    when: 'before',
    action: ['insert'],
    order: 100,
    script: applicationDefaults,
})

BusinessRule({
    $id: Now.ID['br_application_created_audit'],
    name: 'HireMe - Audit Application Created',
    table: 'x_winu_hireme_application',
    when: 'after',
    action: ['insert'],
    order: 100,
    script: auditApplicationCreated,
})

BusinessRule({
    $id: Now.ID['br_application_decision_audit'],
    name: 'HireMe - Audit Final Decision',
    table: 'x_winu_hireme_application',
    when: 'after',
    action: ['update'],
    order: 100,
    // Narrows execution to updates that actually touch the decision field —
    // the script still re-checks old vs new to be certain.
    filterCondition: 'final_decisionISNOTEMPTY',
    script: auditApplicationDecision,
})

/* ---------------- CVDocument ---------------- */

BusinessRule({
    $id: Now.ID['br_cv_ocr_request'],
    name: 'HireMe - Request OCR on Upload',
    table: 'x_winu_hireme_cv_document',
    when: 'after',
    action: ['insert'],
    order: 100,
    script: requestOcrOnInsert,
})

BusinessRule({
    $id: Now.ID['br_cv_ocr_status_change'],
    name: 'HireMe - On OCR Status Change',
    table: 'x_winu_hireme_cv_document',
    when: 'after',
    action: ['update'],
    order: 100,
    filterCondition: 'ocr_statusINcomplete,failed',
    script: onOcrStatusChange,
})

/* ---------------- InterviewSession ---------------- */

BusinessRule({
    $id: Now.ID['br_interview_invited_at'],
    name: 'HireMe - Stamp Invited At',
    table: 'x_winu_hireme_interview_session',
    when: 'before',
    action: ['update'],
    order: 100,
    filterCondition: 'status=invited',
    script: stampInvitedAt,
})

BusinessRule({
    $id: Now.ID['br_interview_status_change'],
    name: 'HireMe - On Interview Status Change',
    table: 'x_winu_hireme_interview_session',
    when: 'after',
    action: ['update'],
    order: 100,
    filterCondition: 'status=completed',
    script: onInterviewStatusChange,
})

/* ---------------- ScoringResult ---------------- */

BusinessRule({
    $id: Now.ID['br_scoring_result_insert'],
    name: 'HireMe - On Scoring Result Insert',
    table: 'x_winu_hireme_scoring_result',
    when: 'after',
    action: ['insert'],
    order: 100,
    filterCondition: 'is_current=true',
    script: onScoringResultInsert,
})

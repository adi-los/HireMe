import '@servicenow/sdk/global'
import { RestApi, Acl } from '@servicenow/sdk/core'
import { handleApply, handleInterest, handleStatus } from '../../server/rest/candidate-portal'

/**
 * Public candidate-facing endpoints (blueprint p.13): apply, soft-apply
 * ("I'm interested"), and status lookup for "My Applications".
 *
 * URL base: /api/x_winu_hireme/hireme_portal
 *   POST /apply     — create Candidate + Application (+ empty CVDocument)
 *   POST /interest  — soft-apply, no CV
 *   GET  /status/{application_id}?access_token=...
 *
 * ACL is deliberately open (`answer = true`) — these must work for an
 * anonymous browser with no ServiceNow session, which is what p.13 means by
 * "no login required." The real access control is inside each handler:
 * `apply`/`interest` only ever create records (nothing to protect against
 * over-sharing), and `status` requires the per-application `access_token`
 * issued at apply time (see open-questions.md #2 and src/server/glide/intake.js).
 *
 * This is the same two-layer pattern as the OCR webhook, just inverted: there
 * the ACL is the strong layer and the token is the second check; here the ACL
 * is deliberately weak because the caller has no identity, and the token
 * inside the business logic is the only real gate.
 */

const portalAcl = Acl({
    $id: Now.ID['acl_candidate_portal'],
    type: 'rest_endpoint',
    name: 'x_winu_hireme/hireme_portal',
    operation: 'execute',
    script: `answer = true;`,
    description: 'Intentionally public. Real access control is the per-application access_token checked in script — see the file header.',
})

export const candidatePortalApi = RestApi({
    $id: Now.ID['restapi_candidate_portal'],
    name: 'HireMe Candidate Portal',
    serviceId: 'hireme_portal',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [portalAcl],
    routes: [
        {
            $id: Now.ID['restapi_portal_apply'],
            name: 'apply',
            path: '/apply',
            method: 'POST',
            active: true,
            authorization: false,
            authentication: true,
            enforceAcl: [portalAcl],
            script: handleApply,
        },
        {
            $id: Now.ID['restapi_portal_interest'],
            name: 'interest',
            path: '/interest',
            method: 'POST',
            active: true,
            authorization: false,
            authentication: true,
            enforceAcl: [portalAcl],
            script: handleInterest,
        },
        {
            $id: Now.ID['restapi_portal_status'],
            name: 'status',
            path: '/status/{application_id}',
            method: 'GET',
            active: true,
            authorization: false,
            authentication: true,
            enforceAcl: [portalAcl],
            script: handleStatus,
        },
    ],
})

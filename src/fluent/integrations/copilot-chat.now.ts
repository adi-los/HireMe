import '@servicenow/sdk/global'
import { RestApi, Acl } from '@servicenow/sdk/core'
import { handleAsk } from '../../server/rest/copilot'
import { recruiterRole, hiringManagerRole, adminRole } from '../security/roles.now'

/**
 * RH Copilot chat endpoint (blueprint p.12), invoked from the CV Viewer's
 * chat panel (`src/client/components/CopilotChat.tsx`).
 *
 * URL: /api/x_winu_hireme/hireme_copilot/ask
 *
 * Role-gated, not public — same shape as the OCR webhook's ACL
 * (`ocr-webhook.now.ts`), because this one guards data instead of a
 * shared secret: ai-agents-brief.md Q4 decided recruiter/hiring_manager/
 * admin only, and candidates must never be able to reach this at all.
 */

const copilotAcl = Acl({
    $id: Now.ID['acl_copilot_chat'],
    type: 'rest_endpoint',
    name: 'x_winu_hireme/hireme_copilot',
    operation: 'execute',
    roles: [recruiterRole, hiringManagerRole, adminRole],
    adminOverrides: true,
    description: 'RH Copilot. Recruiter/hiring manager/admin only — never public, never candidate-reachable (ai-agents-brief.md Q4).',
})

export const copilotChatApi = RestApi({
    $id: Now.ID['restapi_copilot_chat'],
    name: 'HireMe Copilot',
    serviceId: 'hireme_copilot',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [copilotAcl],
    routes: [
        {
            $id: Now.ID['restapi_copilot_ask'],
            name: 'ask',
            path: '/ask',
            method: 'POST',
            active: true,
            authorization: true,
            authentication: true,
            enforceAcl: [copilotAcl],
            script: handleAsk,
        },
    ],
})

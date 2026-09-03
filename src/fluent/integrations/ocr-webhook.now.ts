import '@servicenow/sdk/global'
import { RestApi, Acl } from '@servicenow/sdk/core'
import { handleOcrCallback } from '../../server/rest/ocr-callback'
import { integrationRole } from '../security/roles.now'

/**
 * Inbound callback the OCR provider POSTs to when extraction finishes
 * (blueprint p.06 step 3: "async Flow calls the OCR service ... via webhook
 * callback").
 *
 * URL: /api/x_winu_hireme/hireme_ocr/callback
 *
 * Two layers of defense, deliberately not just one:
 *   1. This ACL — the caller must authenticate as `x_winu_hireme.integration`.
 *   2. The shared-secret token checked inside `handleOcrCallback` itself.
 * A leaked service-account credential or a leaked token alone is not enough
 * to forge a callback.
 */

const ocrWebhookAcl = Acl({
    $id: Now.ID['acl_ocr_webhook'],
    type: 'rest_endpoint',
    name: 'x_winu_hireme/hireme_ocr',
    operation: 'execute',
    roles: [integrationRole],
    adminOverrides: true,
    description: 'OCR provider callback. Service-account role only.',
})

export const ocrWebhook = RestApi({
    $id: Now.ID['restapi_ocr_webhook'],
    name: 'HireMe OCR Callback',
    serviceId: 'hireme_ocr',
    consumes: 'application/json',
    produces: 'application/json',
    enforceAcl: [ocrWebhookAcl],
    routes: [
        {
            $id: Now.ID['restapi_ocr_webhook_callback'],
            name: 'callback',
            path: '/callback',
            method: 'POST',
            active: true,
            // Confusingly named by the platform: `authorization` = caller must
            // be authenticated, `authentication` = ACLs are enforced. Both on.
            authorization: true,
            authentication: true,
            enforceAcl: [ocrWebhookAcl],
            script: handleOcrCallback,
        },
    ],
})

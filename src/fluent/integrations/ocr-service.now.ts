import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * Outbound call to the OCR provider (blueprint p.04/p.06 step 3).
 *
 * Provider-agnostic on purpose — endpoint and auth are runtime config
 * (`x_winu_hireme.ocr.endpoint`, set via Property), not hard-coded, so
 * switching from Azure Document Intelligence to anything else needs no
 * redeploy. See docs/open-questions.md #4 — no provider has been chosen yet,
 * so `authenticationType` is 'noAuthentication' as a placeholder. Once a
 * provider is picked, wire the real auth profile here.
 *
 * The extract function is called from `src/server/glide/ocr.js` via
 * `sn_ws.RESTMessageV2('HireMe OCR Service', 'extract')`.
 */
export const ocrService = RestMessage({
    $id: Now.ID['restmsg_ocr_service'],
    name: 'HireMe OCR Service',
    endpoint: '${base_url}',
    description: 'Sends a CV attachment for text extraction. Provider TBD — see open-questions.md #4.',
    authenticationType: 'noAuthentication',
    access: 'packagePrivate',
    functions: [
        {
            name: 'extract',
            httpMethod: 'POST',
            content: '${payload}',
            headers: [
                { $id: Now.ID['restmsg_ocr_extract_hdr_ct'], name: 'Content-Type', value: 'application/json' },
                { $id: Now.ID['restmsg_ocr_extract_hdr_cb'], name: 'X-Callback-Token', value: '${callback_token}' },
            ],
            // JSON payload — noEscaping so setStringParameterNoEscape() is used
            // at call time and the JSON body isn't XML-entity-escaped.
            variables: [
                { $id: Now.ID['restmsg_ocr_var_base'], name: 'base_url', escapeType: 'noEscaping' },
                { $id: Now.ID['restmsg_ocr_var_payload'], name: 'payload', escapeType: 'noEscaping' },
                { $id: Now.ID['restmsg_ocr_var_token'], name: 'callback_token', escapeType: 'noEscaping' },
            ],
        },
    ],
})

import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * Apply form (blueprint p.13: "Short form + drag-and-drop CV upload +
 * explicit consent checkbox"). Public, unauthenticated. Reads `?job=<sys_id>`
 * from the URL (via $location, client-side) and submits the application —
 * candidate details, CV file, consent — in one round trip.
 *
 * File upload path: the file is read client-side as base64 (FileReader) and
 * sent inside the normal c.server.update() payload, then written server-side
 * via GlideSysAttachment.writeBase64() onto the CVDocument row. This avoids
 * a second multipart HTTP call to the platform Attachment API (and the
 * separate public ACL that would need) — everything happens in the one
 * request that also creates Candidate/Application/CVDocument.
 */
export const applyFormWidget = SPWidget({
    $id: Now.ID['sp_widget_apply_form'],
    id: 'x_winu_hireme_apply_form',
    name: 'HireMe Apply Form',
    // See the matching comment on the Job Board widget — SPWidget.public
    // defaults to false and is required separately from SPPage.public for
    // an anonymous visitor to actually see the widget's rendered content.
    public: true,
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
})

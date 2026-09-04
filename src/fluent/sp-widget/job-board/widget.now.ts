import '@servicenow/sdk/global'
import { SPWidget } from '@servicenow/sdk/core'

/**
 * Job Board (blueprint p.13) — public, read-only list of open requisitions.
 * Links to the Apply page per job via a query param, no navigation menu
 * needed for a two-page flow.
 */
export const jobBoardWidget = SPWidget({
    $id: Now.ID['sp_widget_job_board'],
    id: 'x_winu_hireme_job_board',
    name: 'HireMe Job Board',
    // `SPWidget.public` defaults to false and is a SEPARATE gate from
    // `SPPage.public` — a public page whose widget has public:false still
    // renders empty widget data (sys_id/template/etc all blank strings) for
    // an anonymous visitor. Not mentioned in the service-portal-guide's own
    // widget example or prose; found by testing as a genuinely logged-out
    // visitor and comparing the raw /api/now/sp/page response against the
    // documented SPWidget API reference, which does list this field.
    public: true,
    htmlTemplate: Now.include('./template.html'),
    clientScript: Now.include('./client_script.js'),
    serverScript: Now.include('./server_script.js'),
    customCss: Now.include('./styles.css'),
})

import '@servicenow/sdk/global'
import { UiPage, Record } from '@servicenow/sdk/core'
import page from '../../client/index.html'
import { hiremeMenu } from '../ui/menu.now'

/**
 * CV Viewer + Profile (blueprint p.12). React UI Page, not Service Portal —
 * the SDK's own service-portal-guide is explicit that Service Portal is for
 * *external* self-service users and internal tools should use UI Pages
 * instead. See src/client/ for the React source; see
 * ApplicationDetail.tsx for why this renders as tabs (RelatedLists) rather
 * than the literal two-column layout the blueprint describes — that's a
 * real constraint of `NowRecordListConnected`, not a shortcut.
 */
/**
 * No `type: 'ui_page'` ACL here, deliberately. The docs have no worked
 * example for that ACL type's `name` convention, and this project has
 * already guessed wrong twice this session on undocumented ACL naming for
 * non-record types (`ux_route`) before finding the real answer by
 * inspecting the instance — not a mistake worth repeating for a page whose
 * actual data is already protected. Every component on this page
 * (`RecordProvider`, `FormColumnLayout`, `RelatedLists`) reads through the
 * same session-authenticated data path as the RH Workspace's own
 * auto-generated record pages, which enforce the Application/CVDocument/
 * CandidateProfile table ACLs already verified by impersonation. A
 * candidate hitting this URL directly sees an empty, broken page, not
 * candidate data — the navigator module's `roles` below only controls
 * whether the link is shown, not the real gate.
 */
export const cvViewerPage = UiPage({
    $id: Now.ID['ui_page_cv_viewer'],
    endpoint: 'x_winu_hireme_cv_viewer.do',
    html: page,
    direct: true,
    description: 'CV and parsed profile review tool for recruiters (blueprint p.12).',
})

Record({
    $id: Now.ID['ui_page_cv_viewer_module'],
    table: 'sys_app_module',
    data: {
        title: 'CV Viewer',
        application: hiremeMenu,
        link_type: 'DIRECT',
        query: 'x_winu_hireme_cv_viewer.do',
        hint: 'CV and parsed profile, side by side',
        roles: ['x_winu_hireme.recruiter', 'x_winu_hireme.hiring_manager', 'x_winu_hireme.admin'],
        active: true,
        order: 150,
    },
})

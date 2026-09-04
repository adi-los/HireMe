import '@servicenow/sdk/global'
import { ServicePortal } from '@servicenow/sdk/core'
import { jobsPage } from '../sp-page/jobs/jobs.now'

/**
 * HireMe Careers — the public candidate-facing portal (blueprint p.13:
 * "public job board and portal"). Service Portal, not a UI Page — the SDK's
 * own service-portal-guide is explicit that Service Portal is for external
 * self-service users and UI Pages are for internal platform users (see the
 * CV Viewer, an internal recruiter tool, for the UI Page side of that split).
 *
 * OOTB Coral theme + Stock Header, no custom branding — verified these
 * sys_ids exist on this instance via `now-sdk query` before use, per the
 * guide's mandatory pre-flight check (they matched the guide's documented
 * defaults exactly). No custom SPMenu: a two-page job-board → apply flow
 * doesn't need top nav, and the guide's OOTB-first rule says skip it unless
 * asked for.
 */
export const hiremePortal = ServicePortal({
    $id: Now.ID['sp_portal_hireme'],
    title: 'HireMe Careers',
    urlSuffix: 'x_winu_hireme',
    homePage: jobsPage,
    loginPage: '6995a144cb11120000f8d856634c9c25', // OOTB Login page — verified on instance
    notFoundPage: '3c2c9063cb11020000f8d856634c9c1f', // OOTB 404 page — verified on instance
    theme: '281507c44317d210ca4c1f425db8f2fd', // OOTB Coral theme — verified on instance
    defaultPortal: false,
    enableFavorites: false,
    inactive: false,
    hidePortalName: false,
})

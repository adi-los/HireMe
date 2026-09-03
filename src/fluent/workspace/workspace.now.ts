import '@servicenow/sdk/global'
import { Workspace, Acl } from '@servicenow/sdk/core'
import { hiremeListConfig } from './list-menu.now'

/**
 * RH Workspace (blueprint p.12) — recruiter queue, candidates, job offers,
 * scores and interview sessions, in the modern UI Builder shell.
 *
 * Real URL (confirmed by clicking through the deployed app, not guessed):
 * /x/winu/hireme-rh/home — scope-prefixed, not the bare /now/{path}/{landing}
 * the workspace-guide's own docs claim.
 */
export const hiremeWorkspace = Workspace({
    $id: Now.ID['hireme_rh_workspace'],
    title: 'HireMe RH Workspace',
    path: 'hireme-rh',
    landingPath: 'home',
    tables: [
        'x_winu_hireme_application',
        'x_winu_hireme_candidate',
        'x_winu_hireme_job_offer',
        'x_winu_hireme_scoring_result',
        'x_winu_hireme_interview_session',
    ],
    listConfig: hiremeListConfig,
})

/**
 * Workspace route ACL.
 *
 * Two things here that don't match the workspace-guide's own documented
 * example, both found by impersonating a role-only demo user (not admin —
 * admin's `adminOverrides:true` masks a broken check either of these two
 * problems would otherwise cause):
 *
 * 1. `name` is NOT bare `{path}.*`. Confirmed by inspecting an out-of-box
 *    workspace's own ux_route ACL on this instance
 *    (`security-center-configuration`, name `now.security-center-configuration.*`):
 *    the real pattern is `now.{path}.*`, with a literal `now.` prefix the
 *    docs never mention.
 *
 * 2. Every ServiceNow instance carries a standing platform-wide `*`
 *    ux_route ACL (`decision_type: allow`, requiring role `canvas_user`)
 *    that gates ALL UI Builder workspace routes as a baseline, on top of
 *    whatever workspace-specific ACL exists. Without `canvas_user`, a
 *    recruiter is denied by that baseline ACL before this one is even
 *    relevant — no amount of fixing the ACL below would have helped. The
 *    real fix is on the roles themselves: see `containsRoles: ['canvas_user']`
 *    on `recruiterRole`/`hiringManagerRole`/`adminRole` in
 *    `security/roles.now.ts`. This matches the SDK's own workspace-guide
 *    example, which sets the identical containment on its example role —
 *    a detail that's easy to read past as a stylistic choice until you hit
 *    this exact wall.
 *
 * The script form below (rather than a plain `roles: [...]` array) is kept
 * deliberately: it's the same pattern already proven throughout
 * `acls.now.ts`, and once `canvas_user` was added this combination was what
 * was actually verified working end-to-end by impersonation.
 */
Acl({
    $id: Now.ID['acl_hireme_workspace_route'],
    type: 'ux_route',
    operation: 'read',
    name: 'now.hireme-rh.*',
    adminOverrides: true,
    script: `
        answer = gs.hasRole('x_winu_hireme.recruiter')
            || gs.hasRole('x_winu_hireme.hiring_manager')
            || gs.hasRole('x_winu_hireme.admin');
    `,
    description: 'Only recruiters, hiring managers and admins can open the RH Workspace.',
})

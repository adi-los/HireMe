import '@servicenow/sdk/global'
import { Dashboard } from '@servicenow/sdk/core'
import { hiremeWorkspace } from './workspace.now'

/**
 * RH Workspace landing dashboard. The workspace guide calls this mandatory
 * — without it the workspace has nothing to land on.
 *
 * Deliberately reads live tables directly rather than KpiSnapshot: this is
 * a small, real-time glance view for a recruiter opening the workspace, not
 * the p.10 analytics dashboard (that's the hourly-aggregated KpiSnapshot
 * table, browsable via the classic nav module already built).
 */
export const hiremeDashboard = Dashboard({
    $id: Now.ID['hireme_dashboard'],
    name: 'HireMe RH Dashboard',
    description: 'Live snapshot of the application queue.',
    tabs: [
        {
            $id: Now.ID['hireme_dashboard_tab_overview'],
            name: 'Overview',
            widgets: [
                {
                    $id: Now.ID['widget_applications_total'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                id: 'ds_applications',
                                label: 'Applications',
                                sourceType: 'table',
                                tableOrViewName: 'x_winu_hireme_application',
                                filterQuery: '',
                            },
                        ],
                        headerTitle: 'Applications Total',
                        metrics: [
                            { dataSource: 'ds_applications', id: 'metric_total', aggregateFunction: 'COUNT', axisId: 'primary' },
                        ],
                    },
                    height: 14,
                    width: 14,
                    position: { x: 0, y: 0 },
                },
                {
                    $id: Now.ID['widget_review_queue'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                id: 'ds_queue',
                                label: 'Awaiting Decision',
                                sourceType: 'table',
                                tableOrViewName: 'x_winu_hireme_application',
                                filterQuery: 'statusINscreened,interviewing^final_decisionISEMPTY',
                            },
                        ],
                        headerTitle: 'Awaiting Decision',
                        metrics: [
                            { dataSource: 'ds_queue', id: 'metric_queue', aggregateFunction: 'COUNT', axisId: 'primary' },
                        ],
                    },
                    height: 14,
                    width: 14,
                    position: { x: 14, y: 0 },
                },
                {
                    $id: Now.ID['widget_top_match'],
                    component: 'single-score',
                    componentProps: {
                        dataSources: [
                            {
                                id: 'ds_top_match',
                                label: 'Top Match',
                                sourceType: 'table',
                                tableOrViewName: 'x_winu_hireme_scoring_result',
                                filterQuery: 'category=top_match^is_current=true',
                            },
                        ],
                        headerTitle: 'Top Match (current)',
                        metrics: [
                            { dataSource: 'ds_top_match', id: 'metric_top_match', aggregateFunction: 'COUNT', axisId: 'primary' },
                        ],
                    },
                    height: 14,
                    width: 20,
                    position: { x: 28, y: 0 },
                },
                {
                    $id: Now.ID['widget_category_distribution'],
                    component: 'donut',
                    componentProps: {
                        dataSources: [
                            {
                                id: 'ds_categories',
                                label: 'Scoring Results',
                                sourceType: 'table',
                                tableOrViewName: 'x_winu_hireme_scoring_result',
                                filterQuery: 'is_current=true',
                            },
                        ],
                        headerTitle: 'Category Distribution',
                        metrics: [
                            { dataSource: 'ds_categories', id: 'metric_category_count', aggregateFunction: 'COUNT', axisId: 'primary' },
                        ],
                        groupBy: [
                            {
                                groupBy: [{ dataSource: 'ds_categories', groupByField: 'category' }],
                                maxNumberOfGroups: 4,
                                showOthers: false,
                            },
                        ],
                    },
                    height: 20,
                    width: 24,
                    position: { x: 0, y: 14 },
                },
            ],
        },
    ],
    visibilities: [
        {
            $id: Now.ID['hireme_dashboard_visibility'],
            experience: hiremeWorkspace,
        },
    ],
    // DashboardPermission.role wants a sys_user_role reference, not a Role()
    // variable directly — Now.ref resolves the name to a sys_id at build time.
    permissions: [
        { $id: Now.ID['hireme_dashboard_perm_recruiter'], role: Now.ref('sys_user_role', { name: 'x_winu_hireme.recruiter' }), canRead: true },
        { $id: Now.ID['hireme_dashboard_perm_manager'], role: Now.ref('sys_user_role', { name: 'x_winu_hireme.hiring_manager' }), canRead: true },
        { $id: Now.ID['hireme_dashboard_perm_admin'], role: Now.ref('sys_user_role', { name: 'x_winu_hireme.admin' }), canRead: true, canWrite: true, owner: true },
    ],
})

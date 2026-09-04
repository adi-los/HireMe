import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { jobBoardWidget } from '../../sp-widget/job-board/widget.now'

export const jobsPage = SPPage({
    pageId: 'x_winu_hireme_jobs',
    title: 'Open Positions',
    public: true,
    draft: false,
    // Plain title, not the guide's `${portal.title}` interpolation — that
    // placeholder rendered literally, unsubstituted, when actually tested.
    dynamicTitleStructure: 'Open Positions - HireMe Careers',
    containers: [
        {
            $id: Now.ID['sp_page_jobs_container_1'],
            name: 'Main Content',
            width: 'container',
            order: 100,
            rows: [
                {
                    $id: Now.ID['sp_page_jobs_row_1'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['sp_page_jobs_col_1'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['sp_page_jobs_instance_1'],
                                    widget: jobBoardWidget,
                                    order: 100,
                                    active: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
})

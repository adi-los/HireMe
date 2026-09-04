import '@servicenow/sdk/global'
import { SPPage } from '@servicenow/sdk/core'
import { applyFormWidget } from '../../sp-widget/apply-form/widget.now'

export const applyPage = SPPage({
    pageId: 'x_winu_hireme_apply',
    title: 'Apply',
    public: true,
    draft: false,
    // See the matching comment on jobs.now.ts — the ${portal.title}
    // placeholder from the guide's example didn't get substituted.
    dynamicTitleStructure: 'Apply - HireMe Careers',
    containers: [
        {
            $id: Now.ID['sp_page_apply_container_1'],
            name: 'Main Content',
            width: 'container',
            order: 100,
            rows: [
                {
                    $id: Now.ID['sp_page_apply_row_1'],
                    order: 100,
                    columns: [
                        {
                            $id: Now.ID['sp_page_apply_col_1'],
                            size: 12,
                            sizeSm: 12,
                            sizeXs: 12,
                            order: 100,
                            instances: [
                                {
                                    $id: Now.ID['sp_page_apply_instance_1'],
                                    widget: applyFormWidget,
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

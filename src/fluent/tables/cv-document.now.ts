import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, MultiLineTextColumn, DateTimeColumn } from '@servicenow/sdk/core'

/**
 * CVDocument — the uploaded file plus its OCR result.
 * The binary itself lives as a sys_attachment on this record.
 */
export const x_winu_hireme_cv_document = Table({
    name: 'x_winu_hireme_cv_document',
    label: 'CV Document',
    display: 'file_name',
    audit: true,
    // See the matching comment on x_winu_hireme_application — the CV Viewer
    // UI Page reads this table via the Table API directly.
    allowWebServiceAccess: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            mandatory: true,
            cascadeRule: 'cascade',
        }),
        file_name: StringColumn({ label: 'File Name', maxLength: 255 }),
        mime_type: StringColumn({ label: 'MIME Type', maxLength: 100 }),
        ocr_status: StringColumn({
            label: 'OCR Status',
            maxLength: 40,
            default: 'pending',
            choices: {
                pending: 'Pending',
                in_progress: 'In Progress',
                complete: 'Complete',
                failed: 'Failed',
            },
        }),
        ocr_error: StringColumn({ label: 'OCR Error', maxLength: 1000 }),
        raw_text: MultiLineTextColumn({ label: 'Raw Text' }),
        ocr_completed_at: DateTimeColumn({ label: 'OCR Completed At' }),
    },
})

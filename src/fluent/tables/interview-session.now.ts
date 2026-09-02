import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, JsonColumn, IntegerColumn, DateTimeColumn } from '@servicenow/sdk/core'

/**
 * InterviewSession — the chat-based AI first round (blueprint p.14).
 * No video, no voice: a question list, answers, a rubric sub-score and flags.
 */
export const x_winu_hireme_interview_session = Table({
    name: 'x_winu_hireme_interview_session',
    label: 'Interview Session',
    audit: true,
    schema: {
        application_ref: ReferenceColumn({
            label: 'Application',
            referenceTable: 'x_winu_hireme_application',
            mandatory: true,
            cascadeRule: 'cascade',
        }),
        status: StringColumn({
            label: 'Status',
            maxLength: 40,
            default: 'invited',
            choices: {
                invited: 'Invited',
                in_progress: 'In Progress',
                completed: 'Completed',
                reviewed: 'Reviewed',
            },
        }),
        // [{ "q": "...", "a": "...", "rubric": { "clarity": 4, ... } }]
        transcript: JsonColumn({ label: 'Transcript' }),
        ai_subscore: IntegerColumn({ label: 'AI Sub-score' }),
        // ["clarify employment gap 2022-2023"]
        flags: JsonColumn({ label: 'Flags' }),
        invited_at: DateTimeColumn({ label: 'Invited At' }),
        completed_at: DateTimeColumn({ label: 'Completed At' }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed By',
            referenceTable: 'sys_user',
            cascadeRule: 'none',
        }),
    },
})

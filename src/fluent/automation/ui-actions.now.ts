import '@servicenow/sdk/global'
import { UiAction, Record } from '@servicenow/sdk/core'
import { acceptApplication, rejectApplication, scheduleCall, scheduleAiInterview, addNote } from '../../server/ui-actions/application-actions'
import { recruiterRole, adminRole } from '../security/roles.now'

/**
 * The Action Bar (blueprint p.12): "Accept · Reject · Call · Schedule AI
 * Interview · Add Note — every action fires a Flow and writes to AuditLog
 * automatically." These are UI Actions on Application rather than a Flow,
 * for the same reason the rest of the automation in this app is business
 * rules: the SDK expresses it more directly and it's easier to unit-test
 * the logic they call (`src/server/ui-actions/application-actions.js`).
 *
 * Every action needs THREE records to actually appear as a button in the
 * RH Workspace, not one — this is undocumented in the property reference
 * and only spelled out in the `ui-action-guide` topic's own prose:
 * `UiAction` itself, plus `sys_ux_form_action` and
 * `sys_ux_form_action_layout_item`. Skip either supporting record and the
 * action is enabled but has no visible entry point in Workspace — it isn't
 * a silent failure so much as an invisible one. Given how many of this
 * project's real bugs turned out to be exactly this class of "compiles
 * clean, does nothing in Workspace," these are verified by impersonation
 * before being called done, same as the workspace ACLs.
 */

const TABLE = 'x_winu_hireme_application'
const ROLES = [recruiterRole, adminRole]

/* ---------------- Accept ---------------- */

const acceptAction = UiAction({
    $id: Now.ID['ui_action_accept'],
    table: TABLE,
    name: 'Accept',
    actionName: 'hireme_accept',
    showUpdate: true,
    condition: "current.final_decision == ''",
    form: { showButton: true, style: 'primary' },
    workspace: { isConfigurableWorkspace: true, showFormButtonV2: true },
    roles: ROLES,
    order: 100,
    script: acceptApplication,
})

const acceptFormAction = Record({
    $id: Now.ID['ui_action_accept_form_action'],
    table: 'sys_ux_form_action',
    data: { table: TABLE, ui_action: acceptAction, action_type: 'ui_action', active: true, name: 'Accept' },
})

Record({
    $id: Now.ID['ui_action_accept_layout_item'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: TABLE,
        name: 'Accept',
        label: 'Accept',
        color: 'primary',
        overflow: false,
        order: 100,
        active: true,
        item_type: 'action',
        action: acceptFormAction,
    },
})

/* ---------------- Reject ---------------- */

const rejectAction = UiAction({
    $id: Now.ID['ui_action_reject'],
    table: TABLE,
    name: 'Reject',
    actionName: 'hireme_reject',
    showUpdate: true,
    condition: "current.final_decision == ''",
    form: { showButton: true, style: 'destructive' },
    workspace: { isConfigurableWorkspace: true, showFormButtonV2: true },
    roles: ROLES,
    order: 200,
    script: rejectApplication,
})

const rejectFormAction = Record({
    $id: Now.ID['ui_action_reject_form_action'],
    table: 'sys_ux_form_action',
    data: { table: TABLE, ui_action: rejectAction, action_type: 'ui_action', active: true, name: 'Reject' },
})

Record({
    $id: Now.ID['ui_action_reject_layout_item'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: TABLE,
        name: 'Reject',
        label: 'Reject',
        color: 'primary-negative',
        overflow: false,
        order: 200,
        active: true,
        item_type: 'action',
        action: rejectFormAction,
    },
})

/* ---------------- Call ---------------- */

const callAction = UiAction({
    $id: Now.ID['ui_action_call'],
    table: TABLE,
    name: 'Call',
    actionName: 'hireme_call',
    showUpdate: true,
    form: { showButton: true, style: 'unstyled' },
    workspace: { isConfigurableWorkspace: true, showFormMenuButtonV2: true },
    roles: ROLES,
    order: 300,
    script: scheduleCall,
})

const callFormAction = Record({
    $id: Now.ID['ui_action_call_form_action'],
    table: 'sys_ux_form_action',
    data: { table: TABLE, ui_action: callAction, action_type: 'ui_action', active: true, name: 'Call' },
})

Record({
    $id: Now.ID['ui_action_call_layout_item'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: TABLE,
        name: 'Call',
        label: 'Call',
        color: 'secondary',
        overflow: true,
        order: 300,
        active: true,
        item_type: 'action',
        action: callFormAction,
    },
})

/* ---------------- Schedule AI Interview ---------------- */

const scheduleInterviewAction = UiAction({
    $id: Now.ID['ui_action_schedule_interview'],
    table: TABLE,
    name: 'Schedule AI Interview',
    actionName: 'hireme_schedule_interview',
    showUpdate: true,
    condition: "current.final_decision == ''",
    form: { showButton: true, style: 'primary' },
    workspace: { isConfigurableWorkspace: true, showFormButtonV2: true },
    roles: ROLES,
    order: 400,
    script: scheduleAiInterview,
})

const scheduleInterviewFormAction = Record({
    $id: Now.ID['ui_action_schedule_interview_form_action'],
    table: 'sys_ux_form_action',
    data: { table: TABLE, ui_action: scheduleInterviewAction, action_type: 'ui_action', active: true, name: 'Schedule AI Interview' },
})

Record({
    $id: Now.ID['ui_action_schedule_interview_layout_item'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: TABLE,
        name: 'Schedule AI Interview',
        label: 'Schedule AI Interview',
        color: 'primary',
        overflow: false,
        order: 400,
        active: true,
        item_type: 'action',
        action: scheduleInterviewFormAction,
    },
})

/* ---------------- Add Note ---------------- */

/**
 * Client-side: prompt for text, stage it on `pending_note`, submit. The
 * server script (`addNote`) reads that field, writes it to AuditLog, and
 * clears it in the same update.
 */
const addNoteAction = UiAction({
    $id: Now.ID['ui_action_add_note'],
    table: TABLE,
    name: 'Add Note',
    actionName: 'hireme_add_note',
    showUpdate: true,
    form: { showButton: true, style: 'unstyled' },
    workspace: {
        isConfigurableWorkspace: true,
        showFormMenuButtonV2: true,
        clientScriptV2: `function onClick(g_form) {
            var note = prompt('Add a note about this candidate:');
            if (note) {
                g_form.setValue('pending_note', note);
                g_form.submit();
            }
        }`,
    },
    roles: ROLES,
    order: 500,
    script: addNote,
})

const addNoteFormAction = Record({
    $id: Now.ID['ui_action_add_note_form_action'],
    table: 'sys_ux_form_action',
    data: { table: TABLE, ui_action: addNoteAction, action_type: 'ui_action', active: true, name: 'Add Note' },
})

Record({
    $id: Now.ID['ui_action_add_note_layout_item'],
    table: 'sys_ux_form_action_layout_item',
    data: {
        table: TABLE,
        name: 'Add Note',
        label: 'Add Note',
        color: 'secondary',
        overflow: true,
        order: 500,
        active: true,
        item_type: 'action',
        action: addNoteFormAction,
    },
})

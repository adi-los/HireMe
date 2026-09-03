import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { recruiterRole, hiringManagerRole, candidateRole } from '../security/roles.now'

/**
 * Demo users for manually verifying the ACL design by impersonation — NOT
 * real accounts. `installMethod: 'demo'` keeps these out of a production
 * install; they exist purely so "does the recruiter role actually see what
 * the governance matrix says it should" can be tested by clicking through
 * the UI as someone who is NOT admin.
 *
 * This matters because most of the recruiter/manager-facing ACLs in
 * acls.now.ts set `adminOverrides: true` — testing as the platform `admin`
 * user would pass every one of them regardless of whether the role logic is
 * actually correct. These users have exactly one HireMe role each and
 * nothing more.
 */

const demoRecruiter = Record({
    $id: Now.ID['demo_user_recruiter'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user',
    data: {
        user_name: 'hireme.demo.recruiter',
        first_name: 'Demo',
        last_name: 'Recruiter',
        email: 'hireme.demo.recruiter@example.invalid',
        active: true,
    },
})

Record({
    $id: Now.ID['demo_user_recruiter_role'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user_has_role',
    data: {
        user: demoRecruiter,
        role: recruiterRole,
        // Record() does not populate platform defaults (documented SDK
        // behavior). Without this explicit 'active', the role grant is
        // inserted but never resolves into the user's session roles —
        // found by impersonating this exact user and seeing an empty role
        // set despite a correct sys_user_has_role row.
        state: 'active',
    },
})

const demoHiringManager = Record({
    $id: Now.ID['demo_user_hiring_manager'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user',
    data: {
        user_name: 'hireme.demo.hiring_manager',
        first_name: 'Demo',
        last_name: 'HiringManager',
        email: 'hireme.demo.hiring_manager@example.invalid',
        active: true,
    },
})

Record({
    $id: Now.ID['demo_user_hiring_manager_role'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user_has_role',
    data: {
        user: demoHiringManager,
        role: hiringManagerRole,
        state: 'active',
    },
})

const demoCandidateUser = Record({
    $id: Now.ID['demo_user_candidate'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user',
    data: {
        user_name: 'hireme.demo.candidate',
        first_name: 'Demo',
        last_name: 'Candidate',
        // Deliberately matches the demo Candidate record's email in
        // demo-applications.now.ts, so impersonating this user exercises the
        // email-match ownership ACL (acl_application_read_candidate).
        email: 'demo.candidate@example.invalid',
        active: true,
    },
})

Record({
    $id: Now.ID['demo_user_candidate_role'],
    $meta: { installMethod: 'demo' },
    table: 'sys_user_has_role',
    data: {
        user: demoCandidateUser,
        role: candidateRole,
        state: 'active',
    },
})

/**
 * Direct Table API access — a deliberate, evidence-based exception to the
 * ui-page-guide's "always use NowRecordListConnected/RecordProvider" rule.
 *
 * Those "connected" components share one module-level singleton
 * (`formFetcherBehaviorClassic` inside @servicenow/react-components'
 * internal `csdb-react` module) that calls
 * `scriptingEnvironment.createFormFetchingBehavior(...)` at import time and
 * requires the Agent Workspace app-shell bootstrap to already be running.
 * A bare custom UI Page never triggers that bootstrap, so every one of
 * those components — List, Form, RelatedLists alike — fails identically:
 * `Cannot read properties of undefined (reading 'actionHandlers')`, React
 * never mounts. Confirmed by reading the package's own unminified source
 * (`node_modules/@servicenow/react-components/dist/csdb-react/index.js`),
 * not guessed, and confirmed reproducible across both list and form paths,
 * multiple tables, and multiple deploys.
 *
 * Table-level read ACLs (recruiter/hiring_manager/admin only — see
 * `src/fluent/security/acls.now.ts`) remain the real access boundary;
 * `allowWebServiceAccess: true` on these three tables only lets this REST
 * surface reach those same ACLs, same as any other Table API caller.
 */

export interface TableApiOptions {
    fields?: string
    query?: string
    limit?: number
}

async function tableApiFetch(table: string, options: TableApiOptions = {}): Promise<any[]> {
    const params = new URLSearchParams({ sysparm_display_value: 'all' })
    if (options.fields) params.set('sysparm_fields', options.fields)
    if (options.query) params.set('sysparm_query', options.query)
    if (options.limit) params.set('sysparm_limit', String(options.limit))

    const response = await fetch(`/api/now/table/${table}?${params}`, {
        headers: {
            Accept: 'application/json',
            'X-UserToken': (window as any).g_ck,
        },
        credentials: 'same-origin',
    })
    if (!response.ok) {
        throw new Error(`Table API request to ${table} failed: ${response.status}`)
    }
    const body = await response.json()
    return body.result || []
}

export function fetchApplications(limit = 25): Promise<any[]> {
    return tableApiFetch('x_winu_hireme_application', {
        fields: 'sys_id,number,candidate_ref,joboffer_ref,status,applied_date',
        limit,
    })
}

export function fetchCvDocumentForApplication(applicationId: string): Promise<any | null> {
    return tableApiFetch('x_winu_hireme_cv_document', {
        fields: 'file_name,ocr_status,raw_text',
        query: `application_ref=${applicationId}`,
        limit: 1,
    }).then(rows => rows[0] || null)
}

export function fetchProfileForApplication(applicationId: string): Promise<any | null> {
    return tableApiFetch('x_winu_hireme_candidate_profile', {
        fields: 'skills,experience_years,education,data_confidence',
        query: `application_ref=${applicationId}`,
        limit: 1,
    }).then(rows => rows[0] || null)
}

export function fetchChatHistory(applicationId: string, limit = 50): Promise<any[]> {
    return tableApiFetch('x_winu_hireme_chat_interaction', {
        fields: 'role,message,citations,timestamp',
        query: `application_ref=${applicationId}^channel=rh_copilot^ORDERBYtimestamp`,
        limit,
    })
}

export function fetchApplicationHeader(applicationId: string): Promise<any | null> {
    return tableApiFetch('x_winu_hireme_application', {
        fields: 'number,candidate_ref,joboffer_ref,status,final_decision',
        query: `sys_id=${applicationId}`,
        limit: 1,
    }).then(rows => rows[0] || null)
}

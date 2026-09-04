/**
 * RH Copilot chat client — POSTs to the role-gated endpoint defined in
 * `src/fluent/integrations/copilot-chat.now.ts`. Same auth pattern as
 * `tableApi.ts` (X-UserToken from window.g_ck), since this UI Page has no
 * session cookie helper of its own to lean on.
 */

export interface CopilotAnswer {
    answer: string
    citations: string[]
}

export interface CopilotError {
    error: string
}

export async function askCopilot(applicationId: string, question: string): Promise<CopilotAnswer> {
    const response = await fetch('/api/x_winu_hireme/hireme_copilot/ask', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-UserToken': (window as any).g_ck,
        },
        credentials: 'same-origin',
        body: JSON.stringify({ application_id: applicationId, question }),
    })

    const wrapper = await response.json().catch(() => null)
    // Scripted REST API responses are wrapped in a `{ "result": ... }`
    // envelope by the platform — response.setBody(x) on the server becomes
    // { result: x } on the wire. tableApi.ts already accounts for this
    // (`body.result || []`); this call missed it initially, which is why an
    // error response's real message never made it past the generic fallback
    // during impersonated testing — found by reading the actual network
    // response, not guessed.
    const body = wrapper && wrapper.result ? wrapper.result : wrapper
    if (!response.ok) {
        const message = (body && (body as CopilotError).error) || `Copilot request failed: ${response.status}`
        throw new Error(message)
    }
    return body as CopilotAnswer
}

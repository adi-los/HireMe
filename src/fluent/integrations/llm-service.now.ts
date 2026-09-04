import '@servicenow/sdk/global'
import { RestMessage } from '@servicenow/sdk/core'

/**
 * Outbound call to whichever LLM provider is configured
 * (`x_winu_hireme.llm.provider`) — the scoring agent, interview generation
 * and the RH Copilot chatbot all go through this one function.
 *
 * Confirmed on the instance 2026-09-04 (docs/open-questions.md #5): no AI
 * Agent Studio, no sn_generative_ai license here, so there is no native
 * ServiceNow AI construct to lean on — an external API is the only option.
 *
 * Deliberately provider-agnostic, same reasoning as `ocr-service.now.ts`:
 * only `base_url` and `body` are static Fluent variables. Auth headers are
 * NOT declared here, because Anthropic (`x-api-key` + `anthropic-version`)
 * and OpenAI (`Authorization: Bearer ...`) use different header names, and a
 * RestMessage function's declared headers only support a dynamic *value*,
 * not a dynamic *name*. Instead `src/server/glide/llm-client.js` calls
 * `request.setRequestHeader(name, value)` at runtime, after picking the
 * right header for the configured provider.
 */
export const llmService = RestMessage({
    $id: Now.ID['restmsg_llm_service'],
    name: 'HireMe LLM Service',
    endpoint: '${base_url}',
    description: 'Generic outbound call to the configured LLM provider. Provider-specific auth headers are set at runtime by llm-client.js.',
    authenticationType: 'noAuthentication',
    access: 'packagePrivate',
    functions: [
        {
            name: 'complete',
            httpMethod: 'POST',
            content: '${body}',
            headers: [
                { $id: Now.ID['restmsg_llm_hdr_ct'], name: 'Content-Type', value: 'application/json' },
            ],
            variables: [
                { $id: Now.ID['restmsg_llm_var_base'], name: 'base_url', escapeType: 'noEscaping' },
                { $id: Now.ID['restmsg_llm_var_body'], name: 'body', escapeType: 'noEscaping' },
            ],
        },
    ],
})

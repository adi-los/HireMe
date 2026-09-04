import { gs } from '@servicenow/glide'
import { RESTMessageV2 } from '@servicenow/glide/sn_ws'
import { config } from './config.js'

/**
 * Generic LLM caller, wrapping the `RestMessage` in
 * `src/fluent/integrations/llm-service.now.ts`.
 *
 * Provider-agnostic by design (docs/open-questions.md #5): this instance has
 * neither AI Agent Studio nor sn_generative_ai, so every AI feature in this
 * app — Copilot, interview generation, LLM-assisted scoring — reaches an
 * external API through this one function. Which provider, and the API key,
 * are runtime config (`x_winu_hireme.llm.provider` / `.api_key`), never
 * hardcoded.
 */

const DEFAULT_MODELS = {
    // Chosen provider (2026-09-04, docs/open-questions.md #5): OpenRouter,
    // confirmed working against the real API before being wired in here.
    openrouter: 'meta-llama/llama-3.3-70b-instruct',
    anthropic: 'claude-sonnet-5',
    openai: 'gpt-5.1',
}

const ANTHROPIC_API_VERSION = '2023-06-01'

/** True once an admin has set both provider and API key. */
export function isConfigured() {
    return !!config.llmProvider() && !!config.llmApiKey()
}

function buildRequest(provider, apiKey, model, systemPrompt, userPrompt, maxTokens) {
    // OpenRouter is deliberately OpenAI-compatible (same request/response
    // shape, Authorization: Bearer auth) — it's a routing layer in front of
    // many models, not a model provider with its own API shape.
    if (provider === 'openrouter') {
        return {
            baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
            headers: [['Authorization', 'Bearer ' + apiKey]],
            body: JSON.stringify({
                model: model || DEFAULT_MODELS.openrouter,
                max_tokens: maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            }),
            extractText: function (json) {
                var choice = json && json.choices && json.choices[0]
                return choice && choice.message ? choice.message.content : null
            },
        }
    }

    if (provider === 'anthropic') {
        return {
            baseUrl: 'https://api.anthropic.com/v1/messages',
            headers: [
                ['x-api-key', apiKey],
                ['anthropic-version', ANTHROPIC_API_VERSION],
            ],
            body: JSON.stringify({
                model: model || DEFAULT_MODELS.anthropic,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            }),
            extractText: function (json) {
                var block = json && json.content && json.content[0]
                return block ? block.text : null
            },
        }
    }

    if (provider === 'openai') {
        return {
            baseUrl: 'https://api.openai.com/v1/chat/completions',
            headers: [['Authorization', 'Bearer ' + apiKey]],
            body: JSON.stringify({
                model: model || DEFAULT_MODELS.openai,
                max_tokens: maxTokens,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
            }),
            extractText: function (json) {
                var choice = json && json.choices && json.choices[0]
                return choice && choice.message ? choice.message.content : null
            },
        }
    }

    throw new Error("Unknown LLM provider '" + provider + "'. Set x_winu_hireme.llm.provider to 'anthropic' or 'openai'.")
}

/**
 * Send one system+user prompt to the configured provider; return the raw
 * text of the reply.
 *
 * @param {Object} args
 * @param {string} args.system      system prompt
 * @param {string} args.user        user prompt
 * @param {number} [args.maxTokens] default 1024
 * @returns {string} the model's text reply
 * @throws when not configured, or the HTTP call fails/returns non-2xx
 */
export function complete(args) {
    const provider = config.llmProvider()
    const apiKey = config.llmApiKey()
    if (!provider || !apiKey) {
        throw new Error('LLM not configured: set x_winu_hireme.llm.provider and x_winu_hireme.llm.api_key first.')
    }

    const model = config.llmModel()
    const maxTokens = args.maxTokens || 1024
    const req = buildRequest(provider, apiKey, model, args.system, args.user, maxTokens)

    const request = new RESTMessageV2('HireMe LLM Service', 'complete')
    request.setStringParameterNoEscape('base_url', req.baseUrl)
    request.setStringParameterNoEscape('body', req.body)
    req.headers.forEach(function (h) {
        request.setRequestHeader(h[0], h[1])
    })
    request.setHttpTimeout(30000)

    let response
    try {
        response = request.execute()
    } catch (err) {
        gs.error('[HireMe] LLM request threw: ' + err)
        throw new Error('LLM request failed: ' + err)
    }

    const status = response.getStatusCode()
    const body = response.getBody()
    if (status < 200 || status >= 300) {
        // Never log the body: it may echo back prompt content containing
        // candidate PII (blueprint p.11 data-handling rules apply to logs too).
        gs.error('[HireMe] LLM provider returned HTTP ' + status)
        throw new Error('LLM provider returned HTTP ' + status)
    }

    let parsed
    try {
        parsed = JSON.parse(body)
    } catch (err) {
        throw new Error('LLM response was not valid JSON: ' + err)
    }

    const text = req.extractText(parsed)
    if (!text) {
        throw new Error('LLM response did not contain the expected text field for provider ' + provider)
    }
    return text
}

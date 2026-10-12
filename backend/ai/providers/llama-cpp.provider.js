
const BaseAIProvider = require("./base.provider");
const aiConfig = require("../config/ai.config");

class LlamaCppProvider extends BaseAIProvider {
    constructor(config = {}) {
        super({
            name: "llama.cpp",
            ...config,
        });

        this.baseUrl =
            config.baseUrl ||
            process.env.LLAMA_CPP_BASE_URL ||
            "http://127.0.0.1:1234";

        this.model =
            config.model ||
            process.env.LLAMA_CPP_MODEL_PATH ||
            "Qwen3";

        this.timeout =
            config.timeout ||
            aiConfig.timeout ||
            30000;

        this.maxTokens =
            config.maxTokens ||
            500;
    }

    async generate({
        prompt,
        systemPrompt = null,
        userPrompt = null,
        temperature,
        maxTokens,
    }) {
        const startTime = Date.now();

        try {
            const messages = [];

            if (systemPrompt) {
                messages.push({
                    role: "system",
                    content: systemPrompt,
                });
            }

            messages.push({
                role: "user",
                content: userPrompt || prompt || "",
            });

            const response = await fetch(
                this.baseUrl.replace(/\/+$/, "") +
    "/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages,
                        temperature: temperature ?? 0.3,
                        max_tokens: maxTokens || this.maxTokens,
                        chat_template_kwargs: {
                            enable_thinking: false,
                        },
                        stream: false,
                    }),
                    signal: AbortSignal.timeout(this.timeout),
                }
            );

            if (!response.ok) {
                const details = await response.text();

                throw new Error(
                    "llama.cpp returned HTTP " + response.status + ": " + details
                );
            }

            const data = await response.json();

            const content =
                data?.choices?.[0]?.message?.content?.trim();

            if (!content) {
                throw new Error(
                    "llama.cpp returned an empty response."
                );
            }

            return {
                success: true,
                provider: this.getName(),
                content,
                usage: {
                    promptTokens:
                        data.usage?.prompt_tokens ?? null,
                    completionTokens:
                        data.usage?.completion_tokens ?? null,
                    totalTokens:
                        data.usage?.total_tokens ?? null,
                },
                latency: Date.now() - startTime,
            };
        } catch (error) {
            return {
                success: false,
                provider: this.getName(),
                error: {
                    code:
                        error.name === "TimeoutError" ||
                        error.name === "AbortError"
                            ? "AI_TIMEOUT"
                            : "LLAMA_CPP_PROVIDER_ERROR",
                    message: error.message,
                },
                latency: Date.now() - startTime,
            };
        }
    }

    isAvailable() {
        return true;
    }
}

module.exports = LlamaCppProvider;

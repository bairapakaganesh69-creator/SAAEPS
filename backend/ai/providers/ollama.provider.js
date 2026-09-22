const BaseAIProvider = require("./base.provider");
const aiConfig = require("../config/ai.config");

class OllamaProvider extends BaseAIProvider {
    constructor(config = {}) {
        super({
            name: "ollama",
            ...config,
        });

        this.baseUrl =
            config.baseUrl ||
            process.env.OLLAMA_BASE_URL ||
            "http://localhost:11434";

        this.model =
            config.model ||
            process.env.OLLAMA_MODEL ||
            "qwen3:1.7b";

        this.timeout =
            config.timeout ||
            aiConfig.timeout ||
            30000;

        // Disable Qwen thinking by default for faster academic responses
        this.think =
            config.think !== undefined
                ? config.think
                : false;

        // Default maximum generated tokens
        this.maxTokens =
            config.maxTokens ||
            Number(process.env.OLLAMA_MAX_TOKENS) ||
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

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.timeout);

        try {
            const finalPrompt = userPrompt || prompt;

            const requestBody = {
                model: this.model,
                prompt: finalPrompt,
                stream: false,
                think: this.think,
                options: {},
            };

            if (systemPrompt) {
                requestBody.system = systemPrompt;
            }

            if (temperature !== undefined) {
                requestBody.options.temperature = temperature;
            }

            requestBody.options.num_predict =
                maxTokens || this.maxTokens;

            console.log("==========================================");
            console.log("🤖 OLLAMA AI REQUEST");
            console.log("==========================================");
            console.log("📌 Model:", this.model);
            console.log("📌 URL:", `${this.baseUrl}/api/generate`);
            console.log("📌 Thinking:", this.think);
            console.log(
                "📌 Max Tokens:",
                requestBody.options.num_predict
            );

            const response = await fetch(
                `${this.baseUrl}/api/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `Ollama request failed (${response.status}): ${errorText}`
                );
            }

            const data = await response.json();

            const latency = Date.now() - startTime;

            console.log("✅ Ollama Response Generated");
            console.log("⏱ Response Time:", latency, "ms");

            return {
                success: true,
                provider: this.name,
                model: this.model,

                content: data.response || "",

                usage: {
                    promptTokens:
                        data.prompt_eval_count || 0,

                    completionTokens:
                        data.eval_count || 0,

                    totalTokens:
                        (data.prompt_eval_count || 0) +
                        (data.eval_count || 0),
                },

                latency,
            };

        } catch (error) {
            const latency = Date.now() - startTime;

            console.error(
                "❌ Ollama Provider Error:",
                error.message
            );

            return {
                success: false,
                provider: this.name,
                model: this.model,

                error: {
                    code:
                        error.name === "AbortError"
                            ? "AI_TIMEOUT"
                            : "OLLAMA_PROVIDER_ERROR",

                    message:
                        error.message ||
                        "Ollama provider failed",
                },

                latency,
            };

        } finally {
            clearTimeout(timeoutId);
        }
    }

    isAvailable() {
        return true;
    }

    getName() {
        return this.name;
    }
}

module.exports = OllamaProvider;
const BaseAIProvider = require("./base.provider");
const ai = require("../config/gemini.config");

const { retryAIRequest } = require("../../utils/ai/aiRetry");

const {
    logAIRequest,
    logAIResponse,
    logAIError
} = require("../../utils/ai/aiLogger");

const DEFAULT_MODEL = "gemini-3.5-flash";

class GeminiProvider extends BaseAIProvider {

    constructor(config = {}) {
        super({
            name: "gemini",
            ...config
        });

        this.model = config.model || DEFAULT_MODEL;
    }

    async generate({
        prompt,
        systemPrompt = null,
        userPrompt = null,
        temperature,
        maxTokens
    }) {

        try {

            const startTime = Date.now();

            logAIRequest({
                model: this.model,
                systemPrompt,
                userPrompt
            });

            const response = await retryAIRequest(async () => {

                const request = {
                    model: this.model,
                    contents: prompt
                };

                // These will be used when we add
                // provider-specific generation settings.
                if (temperature !== undefined || maxTokens !== undefined) {

                    request.config = {};

                    if (temperature !== undefined) {
                        request.config.temperature = temperature;
                    }

                    if (maxTokens !== undefined) {
                        request.config.maxOutputTokens = maxTokens;
                    }
                }

                return await ai.models.generateContent(request);

            });

            const responseTime = Date.now() - startTime;

            logAIResponse({
                responseTime,
                usageMetadata: response.usageMetadata
            });

            return {
                success: true,
                provider: this.name,
                model: this.model,

                content: response.text,

                usage: {
                    promptTokens:
                        response.usageMetadata?.promptTokenCount || 0,

                    completionTokens:
                        response.usageMetadata?.candidatesTokenCount || 0,

                    totalTokens:
                        response.usageMetadata?.totalTokenCount || 0
                },

                latency: responseTime
            };

        } catch (error) {

            logAIError(error);

            return {
                success: false,
                provider: this.name,
                model: this.model,

                error: {
                    code: error.code || "AI_PROVIDER_ERROR",
                    message: error.message || "Gemini provider failed"
                }
            };
        }
    }

    isAvailable() {
        return !!ai;
    }

    getName() {
        return this.name;
    }
}

module.exports = GeminiProvider;
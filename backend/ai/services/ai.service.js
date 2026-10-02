const ProviderManager = require("./providerManager");
const AICacheService = require("./cache.service");

const OllamaProvider = require("../providers/ollama.provider");
const GeminiProvider = require("../providers/gemini.provider");

const providerManager = new ProviderManager();
const cacheService = new AICacheService();

// Register Ollama as the local development provider
providerManager.registerProvider(
    new OllamaProvider()
);

// Register Gemini as the fallback provider
providerManager.registerProvider(
    new GeminiProvider()
);

const generateResponse = async (
    systemPrompt,
    userPrompt = null,
    options = {}
) => {

    const fullPrompt = userPrompt
        ? `${systemPrompt}

Student Question:

${userPrompt}`
        : systemPrompt;

    const module =
        options.module ||
        "general";

    const requestedProvider =
        options.provider ||
        "auto";

    const requestedModel =
        options.model &&
        options.model !== "default"
            ? options.model
            : null;

    const cacheKey = cacheService.generateKey({
        module,
        prompt: fullPrompt,
        systemPrompt,
        provider: requestedProvider,
        model: requestedModel
    });

    // --------------------------------
    // Cache lookup
    // --------------------------------

    if (cacheService.isEnabled()) {

        try {

            const cached = await cacheService.get(cacheKey);

            if (cached) {

                console.log(
                    `⚡ AI Cache Hit: ${module}`
                );

                return cached.response;
            }

        } catch (error) {

            console.warn(
                "⚠️ AI cache lookup failed:",
                error.message
            );
        }
    }

    // --------------------------------
    // AI Provider generation
    // --------------------------------

    const result = await providerManager.generate({
        prompt: fullPrompt,

        systemPrompt,

        userPrompt,

        provider:
            requestedProvider,

        model:
            requestedModel,

        temperature:
            options.temperature,

        maxTokens:
            options.maxTokens,

        think:
            options.think ?? false,
    });

    if (!result.success) {

        const error = new Error(
            result.error?.message ||
            "AI generation failed"
        );

        error.code =
            result.error?.code ||
            "AI_SERVICE_UNAVAILABLE";

        error.provider =
            result.provider;

        throw error;
    }

    // --------------------------------
    // Cache successful response
    // --------------------------------

    if (cacheService.isEnabled()) {

        try {

            await cacheService.set({
                cacheKey,

                module,

                provider:
                    result.provider ||
                    requestedProvider,

                model:
                    result.model ||
                    requestedModel,

                prompt: fullPrompt,

                systemPrompt,

                response:
                    result.content,

                usage:
                    result.usage || null,

                latency:
                    result.latency || null
            });

            console.log(
                `💾 AI Cache Stored: ${module}`
            );

        } catch (error) {

            console.warn(
                "⚠️ AI cache storage failed:",
                error.message
            );
        }
    }

    return result.content;
};

module.exports = {
    generateResponse,
    providerManager,
};
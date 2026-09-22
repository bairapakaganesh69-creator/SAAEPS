const ProviderManager = require("./providerManager");
const OllamaProvider = require("../providers/ollama.provider");

const providerManager = new ProviderManager();

// Local AI provider
providerManager.registerProvider(
    new OllamaProvider()
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

    const result = await providerManager.generate({
        prompt: fullPrompt,
        systemPrompt,
        userPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        think: options.think ?? false,
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

    return result.content;
};

module.exports = {
    generateResponse,
    providerManager,
};
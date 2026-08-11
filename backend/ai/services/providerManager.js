const aiConfig = require("../config/ai.config");

class ProviderManager {

    constructor() {
        this.providers = new Map();
    }

    registerProvider(provider) {

        if (!provider || typeof provider.getName !== "function") {
            throw new Error("Invalid AI provider");
        }

        const name = provider.getName();

        this.providers.set(name, provider);

        console.log(`✅ AI Provider registered: ${name}`);
    }

    getProvider(name) {

        const provider = this.providers.get(name);

        if (!provider) {
            throw new Error(`AI provider not registered: ${name}`);
        }

        return provider;
    }

    getProviderOrder() {

        const configuredProviders = [
            aiConfig.providers.primary,
            aiConfig.providers.fallback,
            aiConfig.providers.secondFallback
        ];

        // Remove empty values and duplicates
        return [
            ...new Set(
                configuredProviders.filter(Boolean)
            )
        ];
    }

    async generate(request) {

        const providerOrder = this.getProviderOrder();

        if (providerOrder.length === 0) {
            throw new Error("No AI providers configured");
        }

        let lastError = null;

        for (const providerName of providerOrder) {

            const provider = this.providers.get(providerName);

            if (!provider) {

                console.warn(
                    `⚠️ AI Provider not registered: ${providerName}`
                );

                continue;
            }

            try {

                const available = provider.isAvailable();

                if (!available) {

                    console.warn(
                        `⚠️ AI Provider unavailable: ${providerName}`
                    );

                    continue;
                }

                console.log(
                    `🤖 Trying AI Provider: ${providerName}`
                );

                const result = await provider.generate(request);

                if (result?.success) {

                    return result;

                }

                lastError = result?.error || {
                    code: "AI_PROVIDER_FAILED",
                    message: `${providerName} provider failed`
                };

                console.warn(
                    `⚠️ Provider failed: ${providerName}`
                );

            } catch (error) {

                lastError = {
                    code: error.code || "AI_PROVIDER_ERROR",
                    message:
                        error.message ||
                        `${providerName} provider failed`
                };

                console.warn(
                    `⚠️ Provider error: ${providerName}`,
                    error.message
                );
            }

            if (!aiConfig.features.providerFailover) {
                break;
            }
        }

        return {
            success: false,
            provider: null,
            error: {
                code:
                    lastError?.code ||
                    "AI_SERVICE_UNAVAILABLE",

                message:
                    lastError?.message ||
                    "All configured AI providers are unavailable."
            }
        };
    }
}

module.exports = ProviderManager;
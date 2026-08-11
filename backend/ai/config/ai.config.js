const environment =
    process.env.AI_ENVIRONMENT || process.env.NODE_ENV || "development";

const config = {

    environment,

    providers: {
        primary:
            process.env.AI_PRIMARY_PROVIDER ||
            (environment === "development" ? "ollama" : "gemini"),

        fallback:
            process.env.AI_FALLBACK_PROVIDER || "gemini",

        secondFallback:
            process.env.AI_SECOND_FALLBACK_PROVIDER || null
    },

    cache: {
        enabled:
            process.env.AI_CACHE_ENABLED !== "false",

        ttl:
            Number(process.env.AI_CACHE_TTL) || 86400
    },

    retry: {
        maxAttempts:
            Number(process.env.AI_MAX_RETRIES) || 2
    },

    timeout:
        Number(process.env.AI_TIMEOUT) || 30000,

    logging: {
        enabled:
            process.env.AI_LOGGING_ENABLED !== "false"
    },

    features: {
        providerFailover:
            process.env.AI_FAILOVER_ENABLED !== "false",

        cache:
            process.env.AI_CACHE_ENABLED !== "false"
    }
};

module.exports = config;
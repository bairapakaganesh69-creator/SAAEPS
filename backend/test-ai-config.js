require("dotenv").config();

const aiConfig = require("./ai/config/ai.config");

console.log("\n========== AI CONFIG TEST ==========\n");

console.log("Environment:", aiConfig.environment);

console.log("\nProviders:");
console.log("Primary:", aiConfig.providers.primary);
console.log("Fallback:", aiConfig.providers.fallback);
console.log(
    "Second Fallback:",
    aiConfig.providers.secondFallback || "None"
);

console.log("\nCache:");
console.log("Enabled:", aiConfig.cache.enabled);
console.log("TTL:", aiConfig.cache.ttl);

console.log("\nRetry:");
console.log("Max Attempts:", aiConfig.retry.maxAttempts);

console.log("\nTimeout:");
console.log("Timeout:", aiConfig.timeout);

console.log("\nLogging:");
console.log("Enabled:", aiConfig.logging.enabled);

console.log("\nFeatures:");
console.log(
    "Provider Failover:",
    aiConfig.features.providerFailover
);

console.log(
    "Cache:",
    aiConfig.features.cache
);

console.log("\n====================================\n");
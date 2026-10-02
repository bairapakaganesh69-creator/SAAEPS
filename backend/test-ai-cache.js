const AICacheService = require("./ai/services/cache.service");

const cache = new AICacheService();

console.log("\n========== AI CACHE TEST ==========\n");

const request = {
    module: "tutor",
    prompt: "Explain linked lists.",
    systemPrompt: "You are a helpful computer science tutor.",
    provider: "gemini",
    model: "gemini-3.5-flash"
};

const key1 = cache.generateKey(request);

console.log("Cache Enabled:", cache.isEnabled());

console.log("\nCache Key 1:");
console.log(key1);

const key2 = cache.generateKey(request);

console.log("\nCache Key 2:");
console.log(key2);

console.log("\nKeys Match:", key1 === key2);

console.log("\n===================================\n");
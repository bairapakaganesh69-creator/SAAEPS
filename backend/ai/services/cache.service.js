const crypto = require("crypto");

class AICacheService {

    constructor() {
        this.enabled = true;
    }

    generateKey({
        module,
        prompt,
        systemPrompt = "",
        provider = "auto",
        model = "default"
    }) {

        const cacheInput = JSON.stringify({
            module,
            prompt,
            systemPrompt,
            provider,
            model
        });

        return crypto
            .createHash("sha256")
            .update(cacheInput)
            .digest("hex");
    }

    async get() {
        // Database implementation will be added next.
        return null;
    }

    async set() {
        // Database implementation will be added next.
        return null;
    }

    async delete() {
        // Database implementation will be added next.
        return null;
    }

    async clear() {
        // Database implementation will be added next.
        return null;
    }

    isEnabled() {
        return this.enabled;
    }
}

module.exports = AICacheService;
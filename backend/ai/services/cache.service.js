const crypto = require("crypto");

const { AICache } = require("../../models");
const aiConfig = require("../config/ai.config");

class AICacheService {

    constructor() {
        this.enabled = aiConfig.cache.enabled;
        this.ttl = aiConfig.cache.ttl;
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

    async get(cacheKey) {
        if (!this.enabled || !cacheKey) {
            return null;
        }

        const cached = await AICache.findOne({
            where: {
                cacheKey
            }
        });

        if (!cached) {
            return null;
        }

        if (cached.expiresAt && new Date(cached.expiresAt) <= new Date()) {
            await cached.destroy();
            return null;
        }

        return cached;
    }

    async set({
        cacheKey,
        module,
        provider,
        model,
        prompt,
        systemPrompt = null,
        response,
        usage = null,
        latency = null
    }) {
        if (!this.enabled || !cacheKey) {
            return null;
        }

        const expiresAt = new Date(
            Date.now() + this.ttl * 1000
        );

        return AICache.upsert({
            cacheKey,
            module,
            provider,
            model,
            prompt,
            systemPrompt,
            response,
            usage,
            latency,
            expiresAt
        });
    }

    async delete(cacheKey) {
        if (!cacheKey) {
            return 0;
        }

        return AICache.destroy({
            where: {
                cacheKey
            }
        });
    }

    async clear() {
        return AICache.destroy({
            where: {}
        });
    }

    isEnabled() {
        return this.enabled;
    }
}

module.exports = AICacheService;
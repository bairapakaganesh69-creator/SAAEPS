class BaseAIProvider {
    constructor(config = {}) {
        this.name = config.name || "unknown";
        this.config = config;
    }

    async generate() {
        throw new Error(
            `${this.name} provider must implement the generate() method`
        );
    }

    isAvailable() {
        return true;
    }

    getName() {
        return this.name;
    }
}

module.exports = BaseAIProvider;
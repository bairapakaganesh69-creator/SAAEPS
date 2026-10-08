
require("dotenv").config();

const ProviderManager = require("./ai/services/providerManager");

class MockPrimaryProvider {

    getName() {
        return "ollama";
    }

    isAvailable() {
        return true;
    }

    async generate() {

        console.log("❌ Mock Ollama: simulated failure");

        return {
            success: false,
            provider: "ollama",
            error: {
                code: "PROVIDER_UNAVAILABLE",
                message: "Simulated Ollama failure"
            }
        };
    }
}

class MockFallbackProvider {

    getName() {
        return "gemini";
    }

    isAvailable() {
        return true;
    }

    async generate() {

        console.log("✅ Mock Gemini: simulated success");

        return {
            success: true,
            provider: "gemini",
            model: "mock-model",
            content: "Mock fallback response",

            usage: {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0
            },

            latency: 10
        };
    }
}

async function test() {

    console.log("\n========== PROVIDER MANAGER TEST ==========\n");

    const manager = new ProviderManager();

    manager.registerProvider(
        new MockPrimaryProvider()
    );

    manager.registerProvider(
        new MockFallbackProvider()
    );

    console.log("\nProvider Order:");
    console.log(manager.getProviderOrder());

    console.log("\nSending request...\n");

    const result = await manager.generate({
        prompt: "Test provider failover"
    });

    console.log("\n========== FINAL RESULT ==========\n");

    console.log(
        JSON.stringify(result, null, 2)
    );
}

test();
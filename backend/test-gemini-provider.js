require("dotenv").config();

const GeminiProvider = require("./ai/providers/gemini.provider");

const provider = new GeminiProvider();

async function test() {

    console.log("\n========== GEMINI PROVIDER TEST ==========\n");

    console.log("Provider:", provider.getName());
    console.log("Available:", provider.isAvailable());

    try {

        const result = await provider.generate({
            prompt: "Explain a linked list in one simple paragraph."
        });

        console.log("\n========== RESULT ==========\n");

        console.log(JSON.stringify(result, null, 2));

    } catch (error) {

        console.error("\n========== ERROR ==========\n");

        console.error(error);

    }
}

test();
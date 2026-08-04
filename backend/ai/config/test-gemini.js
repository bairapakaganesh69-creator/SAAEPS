const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

async function main() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello",
        });

        console.log("SUCCESS");
        console.log(response.text);
    } catch (err) {
        console.error("ERROR:");
        console.error(err);
    }
}

main();
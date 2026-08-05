const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (systemPrompt, userPrompt) => {
    try {

        // Combine system prompt and student question
        const fullPrompt = `
${systemPrompt}

Student Question:
${userPrompt}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: fullPrompt,
        });

        return response.text;

    } catch (error) {

        console.error("========== GEMINI ERROR ==========");
        console.error(error);

        throw error;
    }
};

module.exports = {
    generateResponse,
};
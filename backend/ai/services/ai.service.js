const ai = require("../config/gemini");

async function generateResponse(systemPrompt, userPrompt) {
    try {

        const fullPrompt = `
${systemPrompt}

Student Question:
${userPrompt}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        return response.text;

    } catch (error) {

        console.error("Gemini Error:", error);

        throw new Error("Failed to generate AI response");
    }
}

module.exports = {
    generateResponse,
};
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (fullPrompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: fullPrompt,
        });

        console.log("========== GEMINI RESPONSE ==========");
        console.log(response);

        return response.text;

    } catch (error) {
        console.error("========== GEMINI ERROR ==========");
        console.error(error);

        if (error.status) {
            console.error("Status:", error.status);
        }

        if (error.message) {
            console.error("Message:", error.message);
        }

        throw error;
    }
};

module.exports = {
    generateResponse,
};
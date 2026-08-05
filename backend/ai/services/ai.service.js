const ai = require("../config/gemini.config");

const generateResponse = async (systemPrompt, userPrompt) => {

    try {

        const fullPrompt = `
${systemPrompt}

Student Question:

${userPrompt}
`;

        console.log("========== SYSTEM PROMPT ==========\n");
        console.log(systemPrompt);

        console.log("\n========== USER PROMPT ==========\n");
        console.log(userPrompt);

        console.log("\n========== FULL PROMPT ==========\n");
        console.log(fullPrompt);

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: fullPrompt,
        });

        console.log("\n========== GEMINI RESPONSE ==========");
        console.log(response);

        return response.text;

    } catch (error) {

        console.error("\n========== GEMINI ERROR ==========");
        console.error(error);

        throw error;

    }

};

module.exports = {
    generateResponse,
};
const ai = require("../config/gemini.config");
const { retryAIRequest } = require("../../utils/ai/aiRetry");

const {
    logAIRequest,
    logAIResponse,
    logAIError
} = require("../../utils/ai/aiLogger");

const DEFAULT_MODEL = "gemini-3.5-flash";

const generateResponse = async (
    systemPrompt,
    userPrompt = null
) => {

    try {

        const startTime = Date.now();

        const fullPrompt = userPrompt
            ? `${systemPrompt}

Student Question:

${userPrompt}`
            : systemPrompt;

        logAIRequest({
            model: DEFAULT_MODEL,
            systemPrompt,
            userPrompt
        });

const response = await retryAIRequest(async () => {

    return await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: fullPrompt,
    });

});

        const responseTime = Date.now() - startTime;

        logAIResponse({
            responseTime,
            usageMetadata: response.usageMetadata
        });

        return response.text;

    } catch (error) {

        logAIError(error);

        throw error;

    }

};

module.exports = {
    generateResponse,
};
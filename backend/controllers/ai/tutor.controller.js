const { generateResponse } = require("../../ai/services/ai.service");
const tutorPrompt = require("../../ai/prompts/tutor.prompt");

// Response Formatter
const {
    sendSuccessResponse
} = require("../../utils/ai/aiResponseFormatter");

// Import the WHOLE module first
const errorHandler = require("../../utils/ai/aiErrorHandler");

console.log("\n==============================");
console.log("Imported aiErrorHandler:");
console.log(errorHandler);
console.log("==============================\n");

// Extract the function
const { handleAIError } = errorHandler;

const tutorChat = async (req, res) => {

    try {

        const { prompt } = req.body;

        const response = await generateResponse(
            tutorPrompt,
            prompt
        );

        return sendSuccessResponse(
            res,
            response
        );

    } catch (error) {

        return handleAIError(
            res,
            error
        );

    }

};

module.exports = {
    tutorChat
};
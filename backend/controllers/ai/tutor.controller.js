const { generateResponse } = require("../../ai/services/ai.service");
const tutorPrompt = require("../../ai/prompts/tutor.prompt");

const {
    sendSuccessResponse
} = require("../../utils/ai/aiResponseFormatter");

const errorHandler = require("../../utils/ai/aiErrorHandler");

const {
    handleAIError
} = errorHandler;


const tutorChat = async (req, res) => {

    try {

        const {
            prompt,
            subject,
            topic,
            question
        } = req.body;


        let userQuery;


        // New intelligent tutor format
        if (question) {

            userQuery = `
Subject: ${subject || "General"}

Topic: ${topic || "General"}

Student Question:
${question}
            `;

        }

        // Old tutor format support
        else {

            userQuery = prompt;

        }


        const response = await generateResponse(
            tutorPrompt,
            userQuery
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
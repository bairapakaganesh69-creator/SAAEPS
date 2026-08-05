const { generateResponse } = require("../../ai/services/ai.service");
const plannerPrompt = require("../../ai/prompts/planner.prompt");

const { parseAIResponse } = require("../../utils/ai/aiJsonParser");

const {
    sendSuccessResponse
} = require("../../utils/ai/aiResponseFormatter");

const {
    handleAIError
} = require("../../utils/ai/aiErrorHandler");


const studyPlanner = async (req, res) => {

    try {

        const {
            studentName,
            goal,
            subject,
            durationDays,
            studyHoursPerDay,
            weakTopics
        } = req.body;


        const prompt = `
Student Name: ${studentName}

Goal: ${goal}

Subject: ${subject}

Duration (Days): ${durationDays}

Study Hours Per Day: ${studyHoursPerDay}

Weak Topics:
${JSON.stringify(weakTopics, null, 2)}
`;


        const aiResponse = await generateResponse(
            plannerPrompt,
            prompt
        );


        const parsedResponse = parseAIResponse(
            aiResponse
        );


        return sendSuccessResponse(
            res,
            parsedResponse
        );


    } catch (error) {

        return handleAIError(
            res,
            error
        );

    }

};


module.exports = {
    studyPlanner,
};
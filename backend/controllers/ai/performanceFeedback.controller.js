const { generateResponse } = require("../../ai/services/ai.service");
const performanceFeedbackPrompt = require("../../ai/prompts/performanceFeedback.prompt");

const { parseAIResponse } = require("../../utils/ai/aiJsonParser");

const {
    sendSuccessResponse
} = require("../../utils/ai/aiResponseFormatter");

const {
    handleAIError
} = require("../../utils/ai/aiErrorHandler");


const performanceFeedback = async (req, res) => {

    try {

        const {
            studentName,
            subject,
            totalMarks,
            obtainedMarks,
            correctAnswers,
            wrongAnswers,
            timeTaken,
            weakTopics,
            strongTopics
        } = req.body;


        const quizData = `
Student Name: ${studentName}

Subject: ${subject}

Total Marks: ${totalMarks}

Obtained Marks: ${obtainedMarks}

Correct Answers: ${correctAnswers}

Wrong Answers: ${wrongAnswers}

Time Taken: ${timeTaken} minutes

Strong Topics:
${strongTopics?.join(", ") || "None"}

Weak Topics:
${weakTopics?.join(", ") || "None"}
`;


        const aiResponse = await generateResponse(
            performanceFeedbackPrompt(quizData)
        );


        const response = parseAIResponse(
            aiResponse
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
    performanceFeedback
};
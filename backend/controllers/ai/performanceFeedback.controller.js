const { generateResponse } = require("../../ai/services/ai.service");
const performanceFeedbackPrompt = require("../../ai/prompts/performanceFeedback.prompt");

const {
    calculatePerformanceFeedback
} = require("../../services/analysis/performanceFeedback.service");

const {
    parseAIResponse
} = require("../../utils/ai/aiJsonParser");

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


        // --------------------------------------------------
        // STEP 1: Deterministic performance analysis
        // --------------------------------------------------

        const analysis =
            calculatePerformanceFeedback({

                studentName,
                subject,
                totalMarks,
                obtainedMarks,
                correctAnswers,
                wrongAnswers,
                timeTaken,
                weakTopics,
                strongTopics

            });


        // --------------------------------------------------
        // STEP 2: AI generates natural-language feedback
        // --------------------------------------------------

        const quizData = `
Student Name:
${analysis.studentName}

Subject:
${analysis.subject}

Total Marks:
${analysis.totalMarks}

Obtained Marks:
${analysis.obtainedMarks}

Percentage:
${analysis.percentage}

Correct Answers:
${analysis.correctAnswers}

Wrong Answers:
${analysis.wrongAnswers}

Accuracy:
${analysis.accuracy}%

Time Taken:
${analysis.timeTaken} minutes

Performance Level:
${analysis.performanceLevel}

Strong Topics:
${analysis.strengths.join(", ") || "None"}

Weak Topics:
${analysis.areasForImprovement.join(", ") || "None"}
`;


        const aiResponse =
            await generateResponse(
                performanceFeedbackPrompt(
                    quizData
                )
            );


        // --------------------------------------------------
        // STEP 3: Parse AI response
        // --------------------------------------------------

        const feedback =
            parseAIResponse(
                aiResponse
            );


        // --------------------------------------------------
        // STEP 4: Return deterministic analysis
        //         + AI-generated feedback
        // --------------------------------------------------

        return sendSuccessResponse(
            res,
            {
                analysis,
                feedback
            }
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
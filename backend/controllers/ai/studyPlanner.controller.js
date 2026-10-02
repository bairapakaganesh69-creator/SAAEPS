const {
    createStudyPlanner
} = require("../../services/analysis/studyPlanner.service");

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
            weakTopics,
            strongTopics,
            previousScore,
            examDate
        } = req.body;


        const studyPlan = createStudyPlanner({

            studentName,

            goal,

            subject,

            durationDays,

            studyHoursPerDay,

            weakTopics,

            strongTopics,

            previousScore,

            examDate

        });


        return sendSuccessResponse(
            res,
            studyPlan
        );


    } catch (error) {

        return handleAIError(
            res,
            error
        );

    }

};


module.exports = {
    studyPlanner
};
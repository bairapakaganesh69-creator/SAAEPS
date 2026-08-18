const {
    evaluateTestAttempt,
    getUserAttempts,
} = require("../services/testAttempt.service");

// Submit and Evaluate Test Attempt
const submitTestAttempt = async (req, res) => {
    try {
        const { testId, attemptId } = req.params;

      const userId = req.user.id;

const result = await evaluateTestAttempt(
    testId,
    attemptId,
    userId
);
        res.status(200).json({
            success: true,
            message: "Test Submitted Successfully",
            result,
        });

    } catch (error) {
        console.error(
            "Submit Test Attempt Error:",
            error
        );

        res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Failed to Submit Test Attempt",
            error:
                error.statusCode
                    ? undefined
                    : error.message,
        });
    }
};

// Get Logged-in User's Test Attempt History
const getMyAttempts = async (req, res) => {
    try {
        const userId = req.user.id;

        const attempts =
            await getUserAttempts(userId);

        res.status(200).json({
            success: true,
            count: attempts.length,

            attempts: attempts.map((attempt) => ({
                attemptId: attempt.id,
                testId: attempt.testId,

                testTitle: attempt.Test
                    ? attempt.Test.title
                    : "Test",

                examType: attempt.Test
                    ? attempt.Test.examType
                    : null,

                score: attempt.score,
                totalMarks: attempt.totalMarks,

                percentage:
                    attempt.totalMarks > 0
                        ? Number(
                              (
                                  (attempt.score /
                                      attempt.totalMarks) *
                                  100
                              ).toFixed(2)
                          )
                        : 0,

                status: attempt.status,

                startedAt: attempt.startedAt,
                submittedAt: attempt.submittedAt,
            })),
        });

    } catch (error) {
        console.error(
            "Get My Attempts Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to Get Test Attempt History",
            error: error.message,
        });
    }
};

module.exports = {
    submitTestAttempt,
    getMyAttempts,
};
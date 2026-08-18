const TestAttempt = require("../models/TestAttempt");
const Test = require("../models/Test");

const {
    getAttemptAnswers,
    calculateSubjectPerformance,
    calculateTopicPerformance,
    getStrongestTopic,
    getWeakestTopic,
    getWeakTopics,
} = require("./performance.service");

/**
 * Get dashboard data for a student.
 */
const getDashboardData = async (userId) => {
    // Get submitted attempts
    const attempts = await TestAttempt.findAll({
        where: {
            userId,
            status: "Submitted",
        },
        include: [
            {
                model: Test,
                attributes: [
                    "id",
                    "title",
                    "examType",
                    "duration",
                    "totalMarks",
                ],
            },
        ],
        order: [["submittedAt", "DESC"]],
    });

    // No submitted tests
    if (attempts.length === 0) {
        return {
            overview: {
                testsAttempted: 0,
                totalScore: 0,
                totalMarks: 0,
                averagePercentage: 0,
            },

            recentTests: [],

            subjectPerformance: [],

            strongestTopic: null,

            weakestTopic: null,

            weakTopics: [],
        };
    }

    // -----------------------------
    // OVERVIEW
    // -----------------------------

    let totalScore = 0;
    let totalMarks = 0;

    attempts.forEach((attempt) => {
        totalScore += Number(
            attempt.score || 0
        );

        totalMarks += Number(
            attempt.totalMarks || 0
        );
    });

    const averagePercentage =
        totalMarks > 0
            ? Number(
                  (
                      (totalScore /
                          totalMarks) *
                      100
                  ).toFixed(2)
              )
            : 0;

    // -----------------------------
    // RECENT TESTS
    // -----------------------------

    const recentTests = attempts
        .slice(0, 5)
        .map((attempt) => ({
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

            submittedAt:
                attempt.submittedAt,
        }));

    // -----------------------------
    // GET ANSWERS
    // -----------------------------

    const attemptIds = attempts.map(
        (attempt) => attempt.id
    );

    const answers =
        await getAttemptAnswers(
            attemptIds
        );

    // -----------------------------
    // PERFORMANCE
    // -----------------------------

    const subjectPerformance =
        calculateSubjectPerformance(
            answers
        );

    const topicPerformance =
        calculateTopicPerformance(
            answers
        );

    // -----------------------------
    // STRONGEST / WEAKEST
    // -----------------------------

    const strongestTopic =
        getStrongestTopic(
            topicPerformance
        );

    const weakestTopic =
        getWeakestTopic(
            topicPerformance
        );

    // -----------------------------
    // WEAK TOPICS
    // -----------------------------

    const weakTopics =
        getWeakTopics(
            topicPerformance
        );

    // -----------------------------
    // FINAL DASHBOARD
    // -----------------------------

    return {
        overview: {
            testsAttempted:
                attempts.length,

            totalScore,

            totalMarks,

            averagePercentage,
        },

        recentTests,

        subjectPerformance,

        strongestTopic,

        weakestTopic,

        weakTopics,
    };
};

module.exports = {
    getDashboardData,
};
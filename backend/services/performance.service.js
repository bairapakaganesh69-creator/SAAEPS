const TestAttemptAnswer = require("../models/TestAttemptAnswer");
const Question = require("../models/Question");
const Topic = require("../models/Topic");
const Subject = require("../models/Subject");
const TestQuestion = require("../models/TestQuestion");
/**
 * Get all answers belonging to the student's submitted attempts
 * and include Question → Topic + Subject.
 */
const getAttemptAnswers = async (attemptIds) => {
    if (!Array.isArray(attemptIds) || attemptIds.length === 0) {
        return [];
    }

    return await TestAttemptAnswer.findAll({
        where: {
            attemptId: attemptIds,
        },
        include: [
            {
                model: Question,
                include: [
                    {
                        model: Topic,
                    },
                    {
                        model: Subject,
                    },
                ],
            },
        ],
    });
};

/**
 * Calculate subject-wise performance.
 */
const calculateSubjectPerformance = (answers) => {
    const subjectData = {};

    answers.forEach((answer) => {
        const question = answer.Question;

        if (!question || !question.Subject) {
            return;
        }

        const subjectId = question.subjectId;

        if (!subjectData[subjectId]) {
            subjectData[subjectId] = {
                subjectId,
                subject: question.Subject.name,
                attempted: 0,
                correct: 0,
                wrong: 0,
            };
        }

        if (answer.selectedAnswer) {
            subjectData[subjectId].attempted++;
        }

        if (answer.isCorrect === true) {
            subjectData[subjectId].correct++;
        }

        if (answer.isCorrect === false) {
            subjectData[subjectId].wrong++;
        }
    });

    return Object.values(subjectData).map((subject) => {
        const accuracy =
            subject.attempted > 0
                ? Number(
                      (
                          (subject.correct /
                              subject.attempted) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        return {
            ...subject,
            accuracy,
        };
    });
};

/**
 * Calculate topic-wise performance.
 */
const calculateTopicPerformance = (answers) => {
    const topicData = {};

    answers.forEach((answer) => {
        const question = answer.Question;

        if (
            !question ||
            !question.Topic ||
            !question.Subject
        ) {
            return;
        }

        const topicId = question.topicId;

        if (!topicData[topicId]) {
            topicData[topicId] = {
                topicId,
                topic: question.Topic.name,

                subjectId: question.subjectId,
                subject: question.Subject.name,

                attempted: 0,
                correct: 0,
                wrong: 0,
            };
        }

        if (answer.selectedAnswer) {
            topicData[topicId].attempted++;
        }

        if (answer.isCorrect === true) {
            topicData[topicId].correct++;
        }

        if (answer.isCorrect === false) {
            topicData[topicId].wrong++;
        }
    });

    return Object.values(topicData).map((topic) => {
        const accuracy =
            topic.attempted > 0
                ? Number(
                      (
                          (topic.correct /
                              topic.attempted) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        let status;

        if (topic.attempted < 3) {
            status = "Not Enough Data";
        } else if (accuracy < 50) {
            status = "Weak";
        } else if (accuracy < 70) {
            status = "Needs Improvement";
        } else {
            status = "Good";
        }

        return {
            ...topic,
            accuracy,
            status,
        };
    });
};

/**
 * Get reliable topics.
 *
 * A topic needs at least 3 attempted questions
 * before it is used for strongest/weakest calculations.
 */
const getReliableTopics = (topicPerformance) => {
    return topicPerformance.filter(
        (topic) => topic.attempted >= 3
    );
};

/**
 * Find strongest topic.
 */
const getStrongestTopic = (topicPerformance) => {
    const reliableTopics =
        getReliableTopics(topicPerformance);

    if (reliableTopics.length === 0) {
        return null;
    }

    return [...reliableTopics].sort(
        (a, b) => b.accuracy - a.accuracy
    )[0];
};

/**
 * Find weakest topic.
 */
const getWeakestTopic = (topicPerformance) => {
    const reliableTopics =
        getReliableTopics(topicPerformance);

    if (reliableTopics.length === 0) {
        return null;
    }

    return [...reliableTopics].sort(
        (a, b) => a.accuracy - b.accuracy
    )[0];
};

/**
 * Get weak topics only.
 */
const getWeakTopics = (topicPerformance) => {
    return topicPerformance.filter(
        (topic) => topic.status === "Weak"
    );
};
/**
 * Calculate overall performance.
 */
const calculateOverallPerformance = (attempts) => {
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

    const averageScore =
        attempts.length > 0
            ? Number(
                  (
                      totalScore /
                      attempts.length
                  ).toFixed(2)
              )
            : 0;

    return {
        totalScore,
        totalMarks,
        averageScore,
        averagePercentage,
    };
};

/**
 * Calculate test-wise performance.
 */
const calculateTestPerformance = (
    attempts
) => {
    return attempts.map((attempt) => ({
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
};
/**
 * Calculate answer statistics.
 */
const calculateAnswerStatistics = (
    answers,
    totalQuestions
) => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;

    answers.forEach((answer) => {
        if (answer.selectedAnswer) {
            answered++;
        }

        if (answer.isCorrect === true) {
            correct++;
        } else if (
            answer.isCorrect === false
        ) {
            wrong++;
        }
    });

    const unanswered = Math.max(
        totalQuestions - answered,
        0
    );

    return {
        totalQuestions,
        answered,
        correct,
        wrong,
        unanswered,
    };
};
/**
 * Get total questions for all submitted attempts.
 */
const getTotalQuestionsForAttempts = async (
    attempts
) => {
    let totalQuestions = 0;

    for (const attempt of attempts) {
        const questionCount =
            await TestQuestion.count({
                where: {
                    testId: attempt.testId,
                },
            });

        totalQuestions += questionCount;
    }

    return totalQuestions;
};
module.exports = {
    getAttemptAnswers,
    calculateOverallPerformance,
    calculateTestPerformance,
    calculateSubjectPerformance,
    calculateTopicPerformance,
    getReliableTopics,
    getStrongestTopic,
    getWeakestTopic,
    getWeakTopics,
    calculateAnswerStatistics,
    getTotalQuestionsForAttempts,
};
const TestAttempt = require("../models/TestAttempt");
const TestAttemptQuestion = require("../models/TestAttemptQuestion");
const TestQuestion = require("../models/TestQuestion");
const Question = require("../models/Question");
const Subject = require("../models/Subject");
const { shuffleQuestionsWithinSections } = require("./questionShuffle.service");

const getAttemptQuestions = async (testId, attemptId, userId) => {
    const attempt = await TestAttempt.findByPk(attemptId);

    if (!attempt) {
        const error = new Error("Test attempt not found");
        error.statusCode = 404;
        throw error;
    }
    if (Number(attempt.testId) !== Number(testId)) {
        const error = new Error("This attempt does not belong to this test");
        error.statusCode = 400;
        throw error;
    }
    if (Number(attempt.userId) !== Number(userId)) {
        const error = new Error("Access denied: this attempt belongs to another student");
        error.statusCode = 403;
        throw error;
    }

    const sourceRows = await TestQuestion.findAll({
        where: { testId },
        attributes: ["questionId", "questionOrder"],
        include: [{
            model: Question,
            attributes: [
                "id", "question", "optionA", "optionB", "optionC", "optionD",
                "difficulty", "marks", "subjectId",
            ],
            include: [{ model: Subject, attributes: ["id", "name"] }],
        }],
        order: [["questionOrder", "ASC"]],
    });

    if (sourceRows.length === 0) {
        const error = new Error("This test has no questions");
        error.statusCode = 400;
        throw error;
    }

    let savedOrder = await TestAttemptQuestion.findAll({
        where: { attemptId },
        order: [["questionOrder", "ASC"]],
    });

    if (savedOrder.length === 0) {
        const shuffled = shuffleQuestionsWithinSections(sourceRows);
        await TestAttemptQuestion.bulkCreate(
            shuffled.map((row) => ({
                attemptId,
                questionId: row.questionId,
                questionOrder: row.questionOrder,
            }))
        );

        savedOrder = await TestAttemptQuestion.findAll({
            where: { attemptId },
            order: [["questionOrder", "ASC"]],
        });
    }

    if (savedOrder.length !== sourceRows.length) {
        throw new Error(
            "Saved attempt question sequence is incomplete. Do not restart or overwrite this attempt; contact an administrator."
        );
    }

    const expectedIds = new Set(sourceRows.map((row) => Number(row.questionId)));
    const savedIds = savedOrder.map((row) => Number(row.questionId));
    if (
        new Set(savedIds).size !== savedIds.length ||
        savedIds.some((id) => !expectedIds.has(id))
    ) {
        throw new Error("Saved attempt question sequence does not match its published test");
    }

    const questionById = new Map(
        sourceRows.map((row) => [Number(row.questionId), row.Question])
    );

    return savedOrder.map((row) => {
        const question = questionById.get(Number(row.questionId));
        if (!question) {
            throw new Error("A saved attempt question is missing from the question bank");
        }
        return {
            id: question.id,
            question: question.question,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            difficulty: question.difficulty,
            marks: question.marks,
            questionOrder: row.questionOrder,
        };
    });
};

module.exports = { getAttemptQuestions };

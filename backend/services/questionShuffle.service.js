const { randomInt } = require("node:crypto");

/**
 * Shuffle questions independently within each subject section.
 * The first appearance of a section defines its display order.
 * Question IDs remain attached to their original answer records.
 */
const shuffleQuestionsWithinSections = (testQuestions, randomIndex = randomInt) => {
    if (!Array.isArray(testQuestions) || testQuestions.length === 0) {
        const error = new Error("The test has no questions to shuffle");
        error.statusCode = 400;
        throw error;
    }

    const sections = new Map();

    for (const row of testQuestions) {
        const question = row.Question || row.question;
        const questionId = Number(row.questionId ?? question?.id);
        const originalOrder = Number(row.questionOrder);
        const subjectId = question?.subjectId ?? question?.Subject?.id ?? question?.subject?.id;

        if (!Number.isInteger(questionId) || questionId <= 0) {
            throw new Error("Every test question must have a valid questionId");
        }
        if (!Number.isInteger(originalOrder) || originalOrder <= 0) {
            throw new Error("Every test question must have a valid original questionOrder");
        }
        if (subjectId === undefined || subjectId === null) {
            throw new Error("Question " + questionId + " has no subject association; section-safe shuffling is not possible");
        }

        const sectionKey = String(subjectId);
        if (!sections.has(sectionKey)) {
            sections.set(sectionKey, { firstOrder: originalOrder, rows: [] });
        }
        sections.get(sectionKey).rows.push({ questionId, originalOrder, sectionKey });
    }

    const orderedSections = [...sections.entries()]
        .sort((a, b) => a[1].firstOrder - b[1].firstOrder);
    const result = [];

    for (const [sectionKey, section] of orderedSections) {
        const original = [...section.rows].sort((a, b) => a.originalOrder - b.originalOrder);
        const shuffled = [...original];

        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = randomIndex(i + 1);
            if (!Number.isInteger(j) || j < 0 || j > i) {
                throw new Error("Random index provider returned an invalid index");
            }
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        if (shuffled.length > 1 &&
            shuffled.every((item, index) => item.questionId === original[index].questionId)) {
            shuffled.push(shuffled.shift());
        }

        for (const item of shuffled) {
            result.push({
                questionId: item.questionId,
                questionOrder: result.length + 1,
                sectionKey,
            });
        }
    }

    if (result.length !== testQuestions.length) {
        throw new Error("Question shuffle changed the test question count");
    }
    return result;
};

module.exports = { shuffleQuestionsWithinSections };

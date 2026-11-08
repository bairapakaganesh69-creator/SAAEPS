const test = require("node:test");
const assert = require("node:assert/strict");
const { shuffleQuestionsWithinSections } = require("../services/questionShuffle.service");

const makeRows = () => [
    { questionId: 1, questionOrder: 1, Question: { id: 1, subjectId: 10 } },
    { questionId: 2, questionOrder: 2, Question: { id: 2, subjectId: 10 } },
    { questionId: 3, questionOrder: 3, Question: { id: 3, subjectId: 10 } },
    { questionId: 4, questionOrder: 4, Question: { id: 4, subjectId: 20 } },
    { questionId: 5, questionOrder: 5, Question: { id: 5, subjectId: 20 } },
];

test("shuffles only inside subject sections and preserves every question ID", () => {
    const result = shuffleQuestionsWithinSections(makeRows(), (max) => max - 1);
    assert.equal(result.length, 5);
    assert.deepEqual(result.map((row) => row.questionId).sort((a, b) => a - b), [1, 2, 3, 4, 5]);
    assert.ok(result.slice(0, 3).every((row) => row.sectionKey === "10"));
    assert.ok(result.slice(3).every((row) => row.sectionKey === "20"));
    assert.deepEqual(result.map((row) => row.questionOrder), [1, 2, 3, 4, 5]);
});

test("rejects records without a subject association", () => {
    assert.throws(() => shuffleQuestionsWithinSections([
        { questionId: 1, questionOrder: 1, Question: { id: 1 } },
    ]), /no subject association/);
});

test("rejects an empty test", () => {
    assert.throws(() => shuffleQuestionsWithinSections([]), /no questions to shuffle/);
});

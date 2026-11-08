const test = require("node:test");
const assert = require("node:assert/strict");
const key = require("../data/source-answer-keys/polycet-2025-code-a.provisional.json");

test("POLYCET 2025 CODE-A key contains all 150 question numbers", () => {
    assert.equal(key.exam, "TS POLYCET");
    assert.equal(key.year, 2025);
    assert.equal(key.paperCode, "A");
    assert.equal(key.answerKeyStatus, "PROVISIONAL");
    assert.equal(key.count, 150);
    assert.equal(key.questions.length, 150);
    assert.deepEqual(
        key.questions.map((row) => row.questionNumber),
        Array.from({ length: 150 }, (_, index) => index + 1)
    );
    assert.ok(key.questions.every((row) => ["A", "B", "C", "D"].includes(row.correctOption)));
});

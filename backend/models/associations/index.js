const Subject = require("../Subject");
const Topic = require("../Topic");
const Question = require("../Question");
const Test = require("../Test");
const TestQuestion = require("../TestQuestion");
const TestAttempt = require("../TestAttempt");
const TestAttemptAnswer = require("../TestAttemptAnswer");
const User = require("../User");
// Subject → Topic
Subject.hasMany(Topic, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});

Topic.belongsTo(Subject, {
    foreignKey: "subjectId",
});

// Topic → Question
Topic.hasMany(Question, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
});

Question.belongsTo(Topic, {
    foreignKey: "topicId",
});

// Subject → Question
Subject.hasMany(Question, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});

Question.belongsTo(Subject, {
    foreignKey: "subjectId",
});
// Test → TestQuestion
Test.hasMany(TestQuestion, {
    foreignKey: "testId",
    onDelete: "CASCADE",
});

TestQuestion.belongsTo(Test, {
    foreignKey: "testId",
});
// Question → TestQuestion
Question.hasMany(TestQuestion, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
});

TestQuestion.belongsTo(Question, {
    foreignKey: "questionId",
});
// Test ↔ Question (Many-to-Many)
Test.belongsToMany(Question, {
    through: TestQuestion,
    foreignKey: "testId",
});

Question.belongsToMany(Test, {
    through: TestQuestion,
    foreignKey: "questionId",
});
// User → TestAttempt
User.hasMany(TestAttempt, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

TestAttempt.belongsTo(User, {
    foreignKey: "userId",
});

// Test → TestAttempt
Test.hasMany(TestAttempt, {
    foreignKey: "testId",
    onDelete: "CASCADE",
});

TestAttempt.belongsTo(Test, {
    foreignKey: "testId",
});
// TestAttempt → TestAttemptAnswer
TestAttempt.hasMany(TestAttemptAnswer, {
    foreignKey: "attemptId",
    onDelete: "CASCADE",
});

TestAttemptAnswer.belongsTo(TestAttempt, {
    foreignKey: "attemptId",
});

// Question → TestAttemptAnswer
Question.hasMany(TestAttemptAnswer, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
});

TestAttemptAnswer.belongsTo(Question, {
    foreignKey: "questionId",
});

module.exports = {
    Subject,
    Topic,
    Question,
    Test,
    TestQuestion,
    TestAttempt,
    TestAttemptAnswer,
    User,
};
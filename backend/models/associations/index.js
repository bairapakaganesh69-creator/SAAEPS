const Subject = require("../Subject");
const Topic = require("../Topic");
const Question = require("../Question");
const QuestionSource = require("../QuestionSource");
const Test = require("../Test");
const TestQuestion = require("../TestQuestion");
const TestAttempt = require("../TestAttempt");
const TestAttemptQuestion = require("../TestAttemptQuestion");
const TestAttemptAnswer = require("../TestAttemptAnswer");
const User = require("../User");
const Notification = require("../Notification");
const Resource = require("../Resource");
// Subject → Topic
Subject.hasMany(Topic, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});

Topic.belongsTo(Subject, {
    foreignKey: "subjectId",
});
// Subject → Resource
Subject.hasMany(Resource, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
});

Resource.belongsTo(Subject, {
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
// Topic → Resource
Topic.hasMany(Resource, {
    foreignKey: "topicId",
    onDelete: "SET NULL",
});

Resource.belongsTo(Topic, {
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
// Question → source provenance
Question.hasOne(QuestionSource, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
});

QuestionSource.belongsTo(Question, {
    foreignKey: "questionId",
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
// User → Notification
User.hasMany(Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Notification.belongsTo(User, {
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
// TestAttempt → randomized attempt question order
TestAttempt.hasMany(TestAttemptQuestion, {
    foreignKey: "attemptId",
    onDelete: "CASCADE",
});

TestAttemptQuestion.belongsTo(TestAttempt, {
    foreignKey: "attemptId",
});

// Question → randomized attempt question order
Question.hasMany(TestAttemptQuestion, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
});

TestAttemptQuestion.belongsTo(Question, {
    foreignKey: "questionId",
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
    QuestionSource,
    Test,
    TestQuestion,
    TestAttempt,
    TestAttemptQuestion,
    TestAttemptAnswer,
    User,
    Notification,
    Resource,
};
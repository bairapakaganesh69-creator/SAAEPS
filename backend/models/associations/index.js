const Subject = require("../Subject");
const Topic = require("../Topic");
const Question = require("../Question");

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

module.exports = {
    Subject,
    Topic,
    Question,
};
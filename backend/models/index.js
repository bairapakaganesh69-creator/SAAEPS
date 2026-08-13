const User = require("./User");
const AICache = require("./AICache");
const Exam = require("./Exam");
const Subject = require("./Subject");
const Topic = require("./Topic");

/* ==========================
   Exam → Subject
========================== */

Exam.hasMany(Subject, {
    foreignKey: "examId",
    as: "subjects",
    onDelete: "CASCADE",
});

Subject.belongsTo(Exam, {
    foreignKey: "examId",
    as: "exam",
});

/* ==========================
   Subject → Topic
========================== */

Subject.hasMany(Topic, {
    foreignKey: "subjectId",
    as: "topics",
    onDelete: "CASCADE",
});

Topic.belongsTo(Subject, {
    foreignKey: "subjectId",
    as: "subject",
});

module.exports = {
    User,
    AICache,
    Exam,
    Subject,
    Topic,
};
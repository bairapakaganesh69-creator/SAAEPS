const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const QuestionSource = sequelize.define("QuestionSource", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    examType: {
        type: DataTypes.ENUM("ECET", "POLYCET"),
        allowNull: false,
    },
    examYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    paperCode: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    originalQuestionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sourcePdf: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sourcePage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    answerKeyStatus: {
        type: DataTypes.ENUM("VISUAL_MARKED", "PROVISIONAL", "OFFICIAL", "VERIFIED"),
        allowNull: false,
    },
    verificationStatus: {
        type: DataTypes.ENUM("CANDIDATE", "VERIFIED", "REJECTED"),
        allowNull: false,
        defaultValue: "CANDIDATE",
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ["examType", "examYear", "branch", "paperCode", "originalQuestionNumber"],
            name: "question_source_identity_unique",
        },
    ],
});

module.exports = QuestionSource;

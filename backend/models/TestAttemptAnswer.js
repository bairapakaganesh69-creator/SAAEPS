const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestAttemptAnswer = sequelize.define("TestAttemptAnswer", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    attemptId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    selectedAnswer: {
        type: DataTypes.ENUM("A", "B", "C", "D"),
        allowNull: true,
    },

    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

    marksObtained: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

module.exports = TestAttemptAnswer;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Question = sequelize.define("Question", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    optionA: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    optionB: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    optionC: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    optionD: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    correctAnswer: {
        type: DataTypes.ENUM("A", "B", "C", "D"),
        allowNull: false,
    },

    difficulty: {
        type: DataTypes.ENUM("Easy", "Medium", "Hard"),
        defaultValue: "Easy",
    },

    marks: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = Question;
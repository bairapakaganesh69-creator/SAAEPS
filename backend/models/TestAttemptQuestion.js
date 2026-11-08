const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestAttemptQuestion = sequelize.define("TestAttemptQuestion", {
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
    questionOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    indexes: [
        { unique: true, fields: ["attemptId", "questionId"] },
        { unique: true, fields: ["attemptId", "questionOrder"] },
    ],
});

module.exports = TestAttemptQuestion;

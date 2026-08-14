const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestAttempt = sequelize.define("TestAttempt", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    startedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },

    submittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    status: {
        type: DataTypes.ENUM("In Progress", "Submitted"),
        defaultValue: "In Progress",
        allowNull: false,
    },

    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },

    totalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = TestAttempt;
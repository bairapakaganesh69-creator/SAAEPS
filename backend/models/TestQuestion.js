const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TestQuestion = sequelize.define("TestQuestion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    testId: {
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
});

module.exports = TestQuestion;
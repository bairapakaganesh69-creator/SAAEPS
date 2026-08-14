const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Test = sequelize.define("Test", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    examType: {
        type: DataTypes.ENUM("ECET", "POLYCET"),
        allowNull: false,
    },

    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    totalMarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM("Draft", "Published"),
        defaultValue: "Draft",
    },
});

module.exports = Test;
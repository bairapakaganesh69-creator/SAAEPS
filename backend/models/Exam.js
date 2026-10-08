const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Exam = sequelize.define(
    "Exam",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        examType: {
            type: DataTypes.ENUM("semester", "ecet", "polycet"),
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        tableName: "exams",
    }
);

module.exports = Exam;
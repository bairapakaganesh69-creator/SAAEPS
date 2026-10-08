const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subject = sequelize.define(
    "Subject",
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
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        examId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        tableName: "subjects",
    }
);

module.exports = Subject;
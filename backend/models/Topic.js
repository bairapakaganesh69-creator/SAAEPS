const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Topic = sequelize.define(
    "Topic",
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

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        subjectId: {
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
        tableName: "topics",
    }
);

module.exports = Topic;
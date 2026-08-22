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

        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: "topics",
    }
);

module.exports = Topic;

module.exports = Topic;
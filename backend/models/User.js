const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("student", "admin"),
      defaultValue: "student",
    },

    // --------------------------------
    // STUDENT PROFILE INFORMATION
    // --------------------------------

    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // --------------------------------
    // EMAIL VERIFICATION
    // --------------------------------

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verificationOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // --------------------------------
    // PASSWORD RESET
    // --------------------------------

    resetOTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetOTPExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    resetOTPVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;
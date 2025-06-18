/**
 * @fileoverview Sequelize model definition for the User entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the User model, which represents the 'users'
 * table in the 'platform' schema of the database. It specifies the model's
 * attributes, data types, constraints, and other configurations.
 */

// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model User
 * @description Represents a user in the application.
 */
const User = sequelize.define('User', {
  /**
   * The unique identifier for the user.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'id_user'
  },
  /**
   * The user's unique username.
   * @type {string}
   * @unique
   */
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  /**
   * The user's unique email address.
   * @type {string}
   * @unique
   */
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  /**
   * The user's hashed password.
   * @type {string}
   */
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  /**
   * The user's age.
   * @type {number}
   */
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: "Age must be an integer."
      },
      min: {
        args: [1],
        msg: "Age must be greater than zero."
      }
    }
  },
  /**
   * The date and time when the user registered.
   * @type {Date}
   */
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'users',
  timestamps: false // Disables the automatic 'createdAt' and 'updatedAt' fields
});

module.exports = User;
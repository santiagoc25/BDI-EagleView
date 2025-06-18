/**
 * @fileoverview Sequelize model definition for the User Role entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Role model, which represents the 'roles'
 * table in the 'platform' schema. It is used to manage user permissions
 * and access control (e.g., 'User', 'Administrator').
 */

// src/models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Role
 * @description Represents a user role within the application.
 */
const Role = sequelize.define('Role', {
  /**
   * The unique identifier for the role.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The name of the role (e.g., "Administrator").
   * @type {string}
   * @unique
   */
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;
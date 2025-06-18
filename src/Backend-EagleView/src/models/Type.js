/**
 * @fileoverview Sequelize model definition for the Content Type entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Type model, which represents the 'types'
 * table in the 'platform' schema. It is used to categorize content, for example,
 * as 'Movie', 'Series', or 'Documentary'.
 */

// src/models/Type.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Type
 * @description Represents a type of content in the application.
 */
const Type = sequelize.define('Type', {
  /**
   * The unique identifier for the content type.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_type: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The name of the content type (e.g., "Movie").
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
  tableName: 'types',
  timestamps: false
});

module.exports = Type;
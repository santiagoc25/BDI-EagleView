/**
 * @fileoverview Sequelize model definition for the Language entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Language model, which represents the 'languages'
 * table in the 'platform' schema. It is used to store the available languages
 * for content audio or subtitles.
 */

// src/models/Language.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Language
 * @description Represents a language available for content.
 */
const Language = sequelize.define('Language', {
  /**
   * The unique identifier for the language.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_language: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The name of the language (e.g., "Spanish", "English").
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
  tableName: 'languages',
  timestamps: false
});

module.exports = Language;
/**
 * @fileoverview Sequelize model definition for the Age Rating entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the AgeRating model, which represents the
 * 'age_ratings' table in the 'platform' schema. It is used to store
 * content age classifications (e.g., G, PG-13, R).
 */

// src/models/AgeRating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model AgeRating
 * @description Represents a content age rating in the application.
 */
const AgeRating = sequelize.define('AgeRating', {
  /**
   * The unique identifier for the age rating.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_age_rating: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The abbreviation for the age rating (e.g., "PG-13").
   * @type {string}
   * @unique
   */
  abbreviation: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'age_ratings',
  timestamps: false
});

module.exports = AgeRating;
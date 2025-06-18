/**
 * @fileoverview Sequelize model definition for the Genre entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Genre model, which represents the 'genres'
 * table in the 'platform' schema. It is used to categorize content by its
 * genre (e.g., Action, Comedy, Sci-Fi).
 */

// src/models/Genre.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Genre
 * @description Represents a content genre in the application.
 */
const Genre = sequelize.define('Genre', {
  /**
   * The unique identifier for the genre.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_genre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The name of the genre (e.g., "Action").
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
  tableName: 'genres',
  timestamps: false
});

module.exports = Genre;
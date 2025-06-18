/**
 * @fileoverview Sequelize model definition for the Content entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Content model, which represents the 'contents'
 * table in the 'platform' schema. This is a central model for storing all
 * audiovisual content like movies, series, and documentaries.
 */

// src/models/Content.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Content
 * @description Represents a piece of audiovisual content in the application.
 */
const Content = sequelize.define('Content', {
  /**
   * The unique identifier for the content item.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_content: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The title of the content.
   * @type {string}
   */
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  /**
   * The foreign key referencing the content's type (e.g., Movie, Series).
   * @type {number}
   */
  id_type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  /**
   * The foreign key referencing the content's age rating.
   * @type {number}
   */
  id_age_rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  /**
   * The year the content was released.
   * @type {number}
   */
  release_year: {
    type: DataTypes.INTEGER
  },
  /**
   * The duration of the content, typically as a formatted string (e.g., "120 min").
   * @type {string}
   */
  duration: {
    type: DataTypes.STRING(20)
  },
  /**
   * The file path or URL to the content's cover image.
   * @type {string}
   */
  image_route: {
    type: DataTypes.STRING(255)
  },
  /**
   * A brief summary or synopsis of the content.
   * @type {string}
   */
  synopsis: {
    type: DataTypes.TEXT
  },
  /**
   * The overall or general rating of the content, possibly calculated.
   * @type {number}
   */
  calification_general: {
    type: DataTypes.DECIMAL(3, 1)
  },
  /**
   * The timestamp of the last update to the content record.
   * @type {Date}
   */
  updated_at: {
    type: DataTypes.DATE
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'contents',
  timestamps: false
});

module.exports = Content;
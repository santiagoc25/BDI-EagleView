/**
 * @fileoverview Sequelize model definition for the Rating entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the Rating model, which represents the 'ratings'
 * table in the 'platform' schema. It stores user-submitted ratings and comments
 * for content items.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model Rating
 * @description Represents a user's rating and comment for a piece of content.
 */
const Rating = sequelize.define('Rating', {
  /**
   * The unique identifier for the rating.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_rating: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The foreign key referencing the user who submitted the rating.
   * @type {number}
   */
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  /**
   * The foreign key referencing the content that was rated.
   * @type {number}
   */
  id_content: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contents',
      key: 'id_content'
    }
  },
  /**
   * The star rating given by the user, from 1 to 5.
   * @type {number}
   */
  stars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  /**
   * The user's written comment.
   * @type {string}
   */
  comment: {
    type: DataTypes.TEXT
  },
  /**
   * The date and time when the rating was submitted.
   * @type {Date}
   */
  rating_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'ratings',
  timestamps: false
});

module.exports = Rating;
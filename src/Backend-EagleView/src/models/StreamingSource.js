/**
 * @fileoverview Sequelize model definition for the Streaming Source entity.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file defines the StreamingSource model, which represents the
 * 'streaming_sources' table in the 'platform' schema. It is used to store
 * information about the platforms where content is available (e.g., Netflix, HBO Max).
 */

// src/models/StreamingSource.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @model StreamingSource
 * @description Represents a streaming platform or source.
 */
const StreamingSource = sequelize.define('StreamingSource', {
  /**
   * The unique identifier for the streaming source.
   * @type {number}
   * @primaryKey
   * @autoIncrement
   */
  id_streaming_source: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  /**
   * The name of the streaming platform (e.g., "Netflix").
   * @type {string}
   */
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  /**
   * The file path or URL to the logo of the streaming platform.
   * @type {string}
   */
  logo_path: {
    type: DataTypes.STRING(255)
  }
}, {
  // Model options
  schema: 'platform',
  tableName: 'streaming_sources',
  timestamps: false
});

module.exports = StreamingSource;
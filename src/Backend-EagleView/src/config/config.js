/**
 * @fileoverview Centralized application configuration.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file loads environment variables from a .env file using 'dotenv'
 * and exports them as a structured configuration object. This allows for easy
 * access to configuration values throughout the application and keeps sensitive
 * data out of the source code.
 */

// src/config/config.js
require('dotenv').config();

/**
 * The main configuration object for the application.
 * @property {number} port - The port on which the server will run.
 * @property {object} db - The database connection configuration.
 * @property {string} db.user - The PostgreSQL database username.
 * @property {string} db.password - The PostgreSQL database password.
 * @property {string} db.host - The database server host.
 * @property {number} db.port - The database server port.
 * @property {string} db.name - The name of the database.
 * @property {string} jwtSecret - The secret key used to sign and verify JSON Web Tokens.
 */
module.exports = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
};
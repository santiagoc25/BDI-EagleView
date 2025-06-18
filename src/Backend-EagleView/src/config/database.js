/**
 * @fileoverview Sequelize database connection configuration.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file initializes and configures the Sequelize instance,
 * which is used to connect to the PostgreSQL database. It reads connection
 * details from the central config file and sets up options for logging
 * and connection pooling.
 */

const { Sequelize } = require('sequelize');
const config = require('./config');

/**
 * The main Sequelize instance for the application.
 * This instance is configured with database credentials, host, dialect,
 * and connection pool settings. It will be imported by all models and
 * other parts of the application that need to interact with the database.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    /**
     * A custom logging function that prefixes all Sequelize-generated SQL
     * queries with '[SEQUELIZE]' for easier debugging in the console.
     * Set to `false` to disable logging.
     */
    logging: (msg) => console.log(`[SEQUELIZE] ${msg}`),
    /**
     * Connection pool configuration to manage database connections efficiently.
     * @property {number} max - Maximum number of connections in the pool.
     * @property {number} min - Minimum number of connections in the pool.
     * @property {number} acquire - Maximum time (in ms) to wait for a connection before throwing an error.
     * @property {number} idle - Maximum time (in ms) a connection can be idle before being released.
     */
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
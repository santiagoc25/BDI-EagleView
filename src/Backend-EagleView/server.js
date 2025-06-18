/**
 * @fileoverview Main server startup script.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This script is the primary entry point for running the application.
 * It imports the configured Express app, establishes a connection to the
 * PostgreSQL database using Sequelize, and starts the HTTP server to listen
 * for incoming requests on the configured port.
 */

// server.js (in the project root)
const app = require('./src/app');
const config = require('./src/config/config');
const sequelize = require('./src/config/database');

const PORT = config.port;

/**
 * Asynchronous function to initialize and start the server.
 * It first attempts to authenticate the database connection. If successful,
 * it starts the Express server. If it fails, it logs a critical error
 * and the process exits.
 * @async
 */
async function startServer() {
  try {
    // Authenticate the database connection.
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Start the server.
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

// Execute the server startup function.
startServer();
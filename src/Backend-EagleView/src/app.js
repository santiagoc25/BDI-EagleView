/**
 * @fileoverview Main application entry point for the EagleView+ backend.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file configures and initializes the Express application. It sets up
 * global middlewares like CORS and JSON parsing, imports all the main route modules,
 * and mounts them on their respective API endpoints. It also starts the server,
 * listening for incoming requests.
 */

// src/app.js

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
const app = express();
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const genreRoutes = require('./routes/genreRoutes'); 
const typeRoutes = require('./routes/typeRoutes');

/**
 * Enables Cross-Origin Resource Sharing (CORS) for all routes,
 * allowing a frontend from a different origin to make requests to this API.
 */
app.use(cors());

/**
 * Parses incoming requests with JSON payloads.
 * This middleware is based on body-parser.
 */
app.use(express.json());

/**
 * Mounts the authentication routes (login, register) on the /api/auth endpoint.
 * @name /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * Mounts the user-related routes (profiles, favorites) on the /api/users endpoint.
 * @name /api/users
 */
app.use('/api/users', userRoutes);

/**
 * Mounts the content-related routes (catalog, details) on the /api/content endpoint.
 * @name /api/content
 */
app.use('/api/content', contentRoutes);

/**
 * Mounts the genre-related routes on the /api/genres endpoint.
 * @name /api/genres
 */
app.use('/api/genres', genreRoutes); 

/**
 * Mounts the content type-related routes on the /api/types endpoint.
 * @name /api/types
 */
app.use('/api/types', typeRoutes);

// When reviews are implemented, they would be added here:
// app.use('/api/reviews', reviewRoutes);

/**
 * Starts the Express server and listens for incoming connections on port 3000.
 */
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000 y configurado para CORS.');
});

/**
 * A simple root route to check if the server is alive and responding.
 * @name /
 * @returns {string} A confirmation message.
 */
app.get('/', (req, res) => {
  res.send('¡API de EagleView+ funcionando correctamente!');
});

/**
 * Exports the configured Express app instance.
 * This is primarily for testing purposes, allowing test files to import the app
 * without starting the server.
 * @module app
 */
module.exports = app;
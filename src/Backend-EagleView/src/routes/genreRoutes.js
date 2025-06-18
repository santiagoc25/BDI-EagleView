/**
 * @fileoverview Defines the routes for content genre-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up the Express router for handling all endpoints
 * under the /api/genres path, such as retrieving a list of all available
 * genres (e.g., Action, Comedy, Drama).
 */

const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/genres
 * @description Retrieves a list of all content genres.
 * @access Private - Requires user to be authenticated.
 */
router.get('/', protect, genreController.getAllGenres);

module.exports = router;
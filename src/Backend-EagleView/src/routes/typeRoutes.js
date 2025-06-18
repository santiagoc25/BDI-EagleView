/**
 * @fileoverview Defines the routes for content type-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up the Express router for handling all endpoints
 * under the /api/types path, such as retrieving a list of all available
 * content types (e.g., Movie, Series).
 */

const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/types
 * @description Retrieves a list of all content types.
 * @access Private - Requires user to be authenticated.
 */
router.get('/', protect, typeController.getAllTypes);

module.exports = router;
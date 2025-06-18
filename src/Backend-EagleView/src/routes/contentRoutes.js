/**
 * @fileoverview Defines the routes for content-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up the Express router for handling all endpoints
 * under the /api/content path. It includes public routes for browsing content,
 * admin-only routes for managing content, and also acts as a parent router
 * for nested rating routes.
 */

// src/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// --- NESTED ROUTE FOR RATINGS ---
const ratingRouter = require('./ratingRoutes');
/**
 * Re-routes any request that matches the pattern '/:contentId/ratings'
 * to the ratingRouter. This allows for clean, nested resource URLs like
 * /api/content/123/ratings.
 * @name /:contentId/ratings
 */
router.use('/:contentId/ratings', ratingRouter);
// -------------------------------------------------


// --- PUBLIC ROUTES ---
/**
 * @route GET /api/content
 * @description Retrieves a list of all content, with optional filtering and searching.
 * @access Public
 */
router.get('/', contentController.getAllContent);

/**
 * @route GET /api/content/:id
 * @description Retrieves the details of a single content item by its ID.
 * @access Public
 * @param {number} id - The ID of the content to retrieve.
 */
router.get('/:id', contentController.getContentById);


// --- ADMINISTRATOR ROUTES ---
/**
 * @route POST /api/content
 * @description Creates a new content item.
 * @access Private (Admin only)
 */
router.post('/', protect, authorize('administrador'), contentController.createContent);

/**
 * @route PUT /api/content/:id
 * @description Updates an existing content item by its ID.
 * @access Private (Admin only)
 * @param {number} id - The ID of the content to update.
 */
router.put('/:id', protect, authorize('administrador'), contentController.updateContent);

/**
 * @route DELETE /api/content/:id
 * @description Deletes a content item by its ID.
 * @access Private (Admin only)
 * @param {number} id - The ID of the content to delete.
 */
router.delete('/:id', protect, authorize('administrador'), contentController.deleteContent);

module.exports = router;
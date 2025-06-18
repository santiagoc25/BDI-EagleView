/**
 * @fileoverview Defines the routes for rating and comment-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up a nested Express router to handle endpoints
 * under a specific content item's path (e.g., /api/content/:contentId/ratings).
 * It allows users to create, view, and delete ratings for a piece of content.
 */

// src/routes/RatingRoutes.js
const express = require('express');
// The { mergeParams: true } option is crucial for accessing :contentId from the parent router.
const router = express.Router({ mergeParams: true });
const ratingController = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

/**
 * @route POST /api/content/:contentId/ratings
 * @description Creates a new rating/comment for a specific content item.
 * @access Private - Requires user to be authenticated.
 */
router.post('/', protect, ratingController.createRating);

/**
 * @route GET /api/content/:contentId/ratings
 * @description Retrieves all ratings/comments for a specific content item.
 * @access Public
 */
router.get('/', ratingController.getRatingsForContent);

/**
 * @route DELETE /api/content/:contentId/ratings/:ratingId
 * @description Deletes a specific rating. Users can typically only delete their own ratings.
 * @access Private - Requires user to be authenticated.
 * @param {number} ratingId - The ID of the rating to be deleted.
 */
router.delete('/:ratingId', protect, ratingController.deleteRating);

module.exports = router;
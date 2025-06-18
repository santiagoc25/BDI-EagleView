/**
 * @fileoverview Defines the routes for user-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up the Express router for handling all endpoints
 * under the /api/users path. It includes routes for managing a user's own profile
 * and favorites, as well as admin-only routes for user management.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Personal Profile Routes
// These routes always act on the currently logged-in user.
router.route('/me')
  /**
   * @route GET /api/users/me
   * @description Gets the profile of the currently authenticated user.
   * @access Private
   */
  .get(protect, userController.getMe)
  /**
   * @route PUT /api/users/me
   * @description Updates the profile of the currently authenticated user.
   * @access Private
   */
  .put(protect, userController.updateMe)
  /**
   * @route DELETE /api/users/me
   * @description Deletes the profile of the currently authenticated user.
   * @access Private
   */
  .delete(protect, userController.deleteMe);

// Favorite Content Routes
router.route('/me/favorites')
  /**
   * @route GET /api/users/me/favorites
   * @description Gets the list of favorite content for the authenticated user.
   * @access Private
   */
  .get(protect, userController.getFavorites)
  /**
   * @route POST /api/users/me/favorites
   * @description Adds a new content item to the user's favorites list.
   * @access Private
   */
  .post(protect, userController.addFavorite);

/**
 * @route DELETE /api/users/me/favorites/:contentId
 * @description Removes a specific content item from the user's favorites list.
 * @access Private
 * @param {number} contentId - The ID of the content to remove.
 */
router.delete('/me/favorites/:contentId', protect, userController.removeFavorite);

// --- Administrator Routes (require 'administrador' role) ---
router.route('/')
  /**
   * @route GET /api/users
   * @description Gets a list of all users in the system.
   * @access Private (Admin only)
   */
  .get(protect, authorize('administrador'), userController.getAllUsers);

router.route('/:id')
  /**
   * @route GET /api/users/:id
   * @description Gets a single user by their ID.
   * @access Private (Admin only)
   * @param {number} id - The ID of the user to retrieve.
   */
  .get(protect, authorize('administrador'), userController.getUserById);

module.exports = router;
/**
 * @fileoverview Defines the routes for authentication-related operations.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file sets up the Express router for handling all endpoints
 * under the /api/auth path, including user registration, login, and a special
 * development-only login route for testing purposes.
 */

// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Middleware for logging incoming requests to this router.
 * This is useful for debugging purposes.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
router.use((req, res, next) => {
  console.log(`>>> [authRoutes.js] Request received for route: ${req.originalUrl}`);
  next();
});

/**
 * @route POST /api/auth/register
 * @description Registers a new user in the system.
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @description Authenticates a user and returns a JWT.
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @description This block conditionally creates a development-only login route.
 * This route allows developers to log in as any user by providing their ID and a
 * secret key, bypassing the need for a password. It is strictly disabled in production.
 */
if (process.env.NODE_ENV !== 'production' && process.env.DEV_LOGIN_SECRET) {
  /**
   * @route POST /api/auth/dev-login
   * @description A special login route for development to get a token for any user.
   * @access Development only
   */
  router.post('/dev-login', authController.devLogin);
}

module.exports = router;
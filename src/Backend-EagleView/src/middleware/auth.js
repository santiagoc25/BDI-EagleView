/**
 * @fileoverview Authentication and authorization middleware for Express.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file provides middleware functions to protect routes.
 * The 'protect' middleware verifies a JWT to authenticate users, while the
 * 'authorize' middleware checks user roles for access control.
 */

// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/config');

/**
 * Middleware to protect routes by verifying a JSON Web Token (JWT).
 * It checks for a 'Bearer' token in the Authorization header, verifies it,
 * and attaches the full user instance (including roles) from the database
 * to the request object (`req.user`).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @async
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify and decode the token
      const decoded = jwt.verify(token, config.jwtSecret);

      // 3. Fetch the user from the database using the ID from the token
      // This ensures req.user is a full Sequelize instance with all its methods and associations.
      req.user = await db.User.findByPk(decoded.user.id, {
        // Include roles to be used by the subsequent 'authorize' middleware
        include: {
          model: db.Role,
          as: 'roles',
          attributes: ['name']
        }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
      }

      next(); // If everything is correct, proceed to the next middleware or controller
    } catch (error) {
      console.error('Authentication error:', error.message);
      return res.status(401).json({ message: 'Not authenticated, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated, no token provided.' });
  }
};

/**
 * Middleware to authorize users based on their roles.
 * This function is a higher-order function that returns a middleware.
 * It should be used AFTER the 'protect' middleware, as it relies on `req.user`.
 * @param {...string} requiredRoles - A list of role names that are allowed to access the route.
 * @returns {function} An Express middleware function.
 */
exports.authorize = (...requiredRoles) => {
  return (req, res, next) => {
    // req.user.roles is now an array of objects: [{ name: 'administrador' }]
    const userRoles = req.user.roles.map(role => role.name);

    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        message: `Access denied. One of the following roles is required: ${requiredRoles.join(', ')}`
      });
    }
    next();
  };
};
/**
 * @fileoverview Controller for handling user authentication logic.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file contains the functions that manage user registration,
 * standard login, and a special development-only login. It handles password
 * hashing, JWT generation, and role assignment.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const config = require('../config/config');
const { Op } = require('sequelize');

/**
 * Handles new user registration.
 * It checks for existing users, hashes the password, creates a new user,
 * and assigns a default 'usuario' role.
 * @param {object} req - The Express request object, containing user data in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }

    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username is already in use.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password_hash, age });

    // Critical logic for role assignment
    const userRole = await Role.findOne({ where: { name: 'usuario' } });

    if (!userRole) {
      console.error("CRITICAL FAILURE! The 'usuario' role was not found in the database.");
      return res.status(500).json({ message: 'Server configuration error: default user role not found.' });
    }

    // Use Sequelize's magic method to create the association in the 'user_roles' join table.
    await newUser.addRole(userRole);

    res.status(201).json({ message: `User ${newUser.username} registered successfully.` });

  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

/**
 * Handles user login.
 * It validates credentials, and if successful, generates and returns a JWT
 * containing the user's ID, username, and roles.
 * @param {object} req - The Express request object, containing email and password in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password_hash'] }
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Get the roles of the authenticated user
    const roles = await user.getRoles({ attributes: ['name'] });

    if (!config.jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // Build the payload with the names of the roles
    const payload = {
      user: {
        id: user.id_user,
        username: user.username,
        // Create an array of strings with the role names. E.g., ['Administrador']
        roles: roles.map(role => role.name)
      }
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    res.status(200).json({ token });

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Handles a special development-only login.
 * This allows developers to obtain a JWT for any user by providing their ID or email
 * along with a master secret key, bypassing the password check. This route is
 * disabled in production environments.
 * @param {object} req - The Express request object, containing an identifier and a secret.
 * @param {object} res - The Express response object.
 * @async
 */
exports.devLogin = async (req, res) => {
  // Extra security measure in case the route is accidentally exposed
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Route not found.' });
  }

  try {
    const { identifier, secret } = req.body;

    // 1. Verify the master development secret
    if (secret !== process.env.DEV_LOGIN_SECRET) {
      return res.status(401).json({ message: 'Invalid development secret.' });
    }

    // 2. Find the user by email or ID
    let user;
    if (typeof identifier === 'string' && identifier.includes('@')) {
      // It's an email
      user = await User.findOne({ where: { email: identifier } });
    } else {
      // It's an ID
      user = await User.findByPk(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found with that identifier.' });
    }

    // 3. Generate and send the token (logic copied from normal login)
    const payload = { user: { id: user.id_user } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });

    res.status(200).json({
      message: `Development login successful for ${user.username}`,
      token
    });

  } catch (error) {
    console.error('[DEV LOGIN ERROR]', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
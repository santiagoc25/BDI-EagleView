/**
 * @fileoverview Controller for handling all user-related business logic.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file contains functions for managing user profiles, favorites,
 * and administrative actions. It handles logic for users managing their own data
 * as well as admin-level operations for viewing all users.
 */

const bcrypt = require('bcryptjs');
const db = require('../models');
const { User, Content, Role } = db;

/**
 * Retrieves the profile of the currently authenticated user.
 * @param {object} req - The Express request object, with user data attached by the 'protect' middleware.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user, {
      attributes: { exclude: ['password_hash'] },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] }
      }
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('[GET ME ERROR]', error);
    res.status(500).json({ message: 'Error retrieving profile.' });
  }
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {object} req - The Express request object, containing update data in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.updateMe = async (req, res) => {
  try {
    const user = req.user; // req.user is a Sequelize instance from the middleware
    const { username, email, age } = req.body;

    await user.update({ username, email, age });

    const updatedUserData = user.toJSON();
    delete updatedUserData.password_hash; // Remove hash from the response

    res.status(200).json(updatedUserData);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email or username is already in use.' });
    }
    console.error('[UPDATE ME ERROR]', error);
    res.status(500).json({ message: 'Error updating profile.' });
  }
};

/**
 * Deletes the profile of the currently authenticated user.
 * Requires the user to provide their current password for confirmation.
 * @param {object} req - The Express request object, containing the password in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.deleteMe = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete the profile.' });
    }

    const user = await db.User.findByPk(userId, {
      attributes: { include: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: 'Your profile has been deleted.' });

  } catch (error) {
    console.error('[DELETE ME ERROR]', error);
    res.status(500).json({ message: 'Internal error while deleting profile.' });
  }
};


// --- FAVORITE MANAGEMENT FUNCTIONS ---

/**
 * Retrieves the list of favorite content for the authenticated user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const favorites = await user.getFavoriteContents({
      attributes: ['id_content', 'title', 'image_route']
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error('[GET FAVORITES ERROR]', error);
    res.status(500).json({ message: 'Error fetching favorites.' });
  }
};

/**
 * Adds a content item to the authenticated user's favorites list.
 * @param {object} req - The Express request object, with contentId in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.addFavorite = async (req, res) => {
  try {
    const { contentId } = req.body;
    const user = await User.findByPk(req.user.id_user);
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    await user.addFavoriteContent(content);

    res.status(201).json({ message: 'Added to favorites.' });
  } catch (error) {
    console.error('[ADD FAVORITE ERROR]', error);
    res.status(500).json({ message: 'Error adding to favorites.' });
  }
};

/**
 * Removes a content item from the authenticated user's favorites list.
 * @param {object} req - The Express request object, with contentId in the URL parameters.
 * @param {object} res - The Express response object.
 * @async
 */
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id_user);
    const { contentId } = req.params;
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.removeFavoriteContent(contentId);

    res.status(204).send();
  } catch (error) {
    console.error('[REMOVE FAVORITE ERROR]', error);
    res.status(500).json({ message: 'Error removing favorite.' });
  }
};

// --- ADMINISTRATOR VIEW FUNCTIONS ---

/**
 * Retrieves a list of all users in the system. (Admin only)
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      order: [['registration_date', 'DESC']],
      attributes: { exclude: ['password_hash'] },
      include: {
        model: db.Role,
        as: 'roles',
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    res.status(200).json(users);

  } catch (error) {
    console.error('[GET ALL USERS ERROR]', error);
    res.status(500).json({ message: 'Internal server error while fetching users.' });
  }
};

/**
 * Retrieves a single user by their ID. (Admin only)
 * @param {object} req - The Express request object, with the user ID in params.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
      include: { model: Role, attributes: ['name'], through: { attributes: [] } }
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(user);
  } catch (error) {
    console.error('[GET USER BY ID ERROR]', error);
    res.status(500).json({ message: 'Error fetching user data.' });
  }
};
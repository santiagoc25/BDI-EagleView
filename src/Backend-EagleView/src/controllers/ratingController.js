/**
 * @fileoverview Controller for handling rating and comment-related logic.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file contains the functions to create, retrieve, and delete
 * user ratings for content items. It includes security checks to ensure users
 * can only delete their own ratings.
 */

// Archivo: src/controllers/ratingController.js
const { Rating, Content, User } = require('../models');

/**
 * Creates a new rating for a specific content item.
 * It checks if the user has already rated the content to prevent duplicates.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.createRating = async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId, 10);
    const { stars, comment } = req.body;
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({ message: 'You are not authenticated or your token is invalid.' });
    }
    const userId = req.user.id_user;
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'The content ID is not valid.' });
    }
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ message: 'The content you are trying to rate does not exist.' });
    }
    const existingRating = await Rating.findOne({ where: { id_user: userId, id_content: contentId } });
    if (existingRating) {
      return res.status(409).json({ message: 'You have already rated this content.' });
    }
    const newRating = await Rating.create({
      id_content: contentId,
      id_user: userId,
      stars,
      comment,
      rating_date: new Date()
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error('[CREATE RATING ERROR]', error);
    res.status(500).json({ message: 'Internal error while creating the review.' });
  }
};

/**
 * Retrieves all ratings for a specific content item.
 * Includes the username of the user who made the rating.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getRatingsForContent = async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId, 10);
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'The content ID is not valid.' });
    }
    const ratings = await Rating.findAll({
      where: { id_content: contentId },
      include: {
        model: User,
        as: 'user',
        attributes: ['id_user', 'username']
      },
      order: [['rating_date', 'DESC']]
    });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('[GET RATINGS ERROR]', error);
    res.status(500).json({ message: 'Error while fetching the reviews.' });
  }
};

/**
 * Deletes a specific rating.
 * This function includes security checks to ensure that only the user who created
 * the rating is able to delete it.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.deleteRating = async (req, res) => {
  try {
    // 1. Key fix: Convert ratingId to an integer.
    const ratingId = parseInt(req.params.ratingId, 10);
    const userId = req.user.id_user;

    // 2. Add validation to ensure the ID is a number.
    if (isNaN(ratingId)) {
      return res.status(400).json({ message: 'The rating ID is not valid.' });
    }

    const rating = await Rating.findByPk(ratingId);

    // 3. This check should now work correctly.
    if (!rating) {
      return res.status(404).json({ message: 'The rating you are trying to delete does not exist.' });
    }

    // 4. Security logic: Only the owner can delete.
    // This line ensures you cannot delete others' comments.
    if (rating.id_user !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this rating.' });
    }

    // 5. If all checks pass, delete the rating.
    await rating.destroy();
    res.status(204).send();

  } catch (error) {
    console.error('[DELETE RATING ERROR]', error);
    res.status(500).json({ message: 'Error while deleting the rating.' });
  }
};
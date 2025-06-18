/**
 * @fileoverview Controller for handling genre-related business logic.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file contains the function to retrieve all available
 * content genres from the database.
 */

const { Genre } = require('../models');

/**
 * Retrieves a list of all genres, sorted alphabetically by name.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
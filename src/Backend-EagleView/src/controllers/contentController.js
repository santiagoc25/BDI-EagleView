/**
 * @fileoverview Controller for handling content-related business logic.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file contains the functions that manage the CRUD operations
 * for content, including advanced filtering, searching, and handling of all
 * related associations like genres, types, and streaming sources.
 */

const { Op } = require('sequelize');
const db = require('../models'); // Unified import of all models

/**
 * Retrieves a list of all content, allowing for dynamic filtering and searching.
 * @param {object} req - The Express request object, containing query parameters for filtering.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getAllContent = async (req, res) => {
  try {
    const { type, genre, search } = req.query;

    // 1. Start with an empty Sequelize options object
    const findOptions = {
      where: {},
      include: [],
      // 'distinct: true' is crucial to prevent duplicate rows when filtering on associations
      distinct: true
    };

    // 2. Build the main 'where' clause for title search
    if (search) {
      findOptions.where.title = { [Op.iLike]: `%${search}%` };
    }

    // 3. Dynamically build the 'include' array for associations
    const typeInclude = { model: db.Type, as: 'type' };
    if (type) {
      typeInclude.where = { name: type };
      typeInclude.required = true; // Forces an INNER JOIN
    }
    findOptions.include.push(typeInclude);

    const genreInclude = { model: db.Genre, as: 'genres', through: { attributes: [] } };
    if (genre) {
      genreInclude.where = { name: genre };
      genreInclude.required = true;
    }
    findOptions.include.push(genreInclude);

    // Include other associations that should always be present
    findOptions.include.push({ model: db.AgeRating, as: 'ageRating' });
    findOptions.include.push({ model: db.Language, as: 'languages', through: { attributes: [] } });
    findOptions.include.push({ model: db.StreamingSource, as: 'streamingSources', through: { attributes: [] } });

    // 4. Execute the query with the constructed options object
    const contents = await db.Content.findAll(findOptions);

    res.status(200).json(contents);

  } catch (error) {
    console.error('[GET ALL CONTENT ERROR]', error);
    res.status(500).json({ message: 'Error retrieving the catalog.' });
  }
};

/**
 * Retrieves a single content item by its ID, including all its detailed associations.
 * @param {object} req - The Express request object, containing the content ID as a parameter.
 * @param {object} res - The Express response object.
 * @async
 */
exports.getContentById = async (req, res) => {
  try {
    const contentId = req.params.id;

    // 1. Get the main content item.
    const content = await db.Content.findByPk(contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    // 2. Eagerly load all associations separately for clarity and easier debugging.
    const type = await content.getType();
    const ageRating = await content.getAgeRating();
    const genres = await content.getGenres();
    const languages = await content.getLanguages();
    const streamingSources = await content.getStreamingSources();
    const ratings = await content.getRatings({
      include: { model: db.User, as: 'user', attributes: ['username'] },
      order: [['rating_date', 'DESC']]
    });

    // 3. Combine everything into a single response object.
    // Using .toJSON() provides a clean object from the Sequelize instance.
    const responseData = {
      ...content.toJSON(),
      type: type,
      ageRating: ageRating,
      genres: genres,
      languages: languages,
      streamingSources: streamingSources,
      ratings: ratings,
    };

    // 4. Send the response.
    res.status(200).json(responseData);

  } catch (error) {
    console.error(`--- DETAILED ERROR GETTING ID ${req.params.id} ---`);
    console.error(error);
    res.status(500).json({ message: 'Internal server error while fetching details.' });
  }
};

/**
 * Creates a new content item.
 * It uses findOrCreate to prevent creating content with a duplicate title.
 * @param {object} req - The Express request object, containing content data in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.createContent = async (req, res) => {
  try {
    const {
      title, id_type, id_age_rating, release_year, duration, image_route, synopsis, calification_general,
      genreIds, languageIds, streamingSourceIds
    } = req.body;

    const contentData = {
      title, id_type, id_age_rating, release_year, duration, image_route, synopsis, calification_general, updated_at: new Date()
    };

    // Use findOrCreate with 'where' for searching and 'defaults' for creation.
    const [content, created] = await db.Content.findOrCreate({
      where: { title: title },
      defaults: contentData
    });

    if (!created) {
      // If the content already existed, return a 409 to inform the frontend.
      return res.status(409).json({ message: 'Content with this title already exists.' });
    }

    // If the content was newly created, set its associations.
    if (genreIds && genreIds.length > 0) await content.setGenres(genreIds);
    if (languageIds && languageIds.length > 0) await content.setLanguages(languageIds);
    if (streamingSourceIds && streamingSourceIds.length > 0) await content.setStreamingSources(streamingSourceIds);

    res.status(201).json(content);

  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'One of the provided IDs is not valid.' });
    }
    console.error('[CREATE CONTENT ERROR]', error);
    res.status(500).json({ message: 'Internal server error while creating content.' });
  }
};

/**
 * Updates an existing content item by its ID.
 * @param {object} req - The Express request object, with the ID in params and update data in the body.
 * @param {object} res - The Express response object.
 * @async
 */
exports.updateContent = async (req, res) => {
  try {
    const content = await db.Content.findByPk(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found.' });

    const { genreIds, languageIds, streamingSourceIds, ...updateData } = req.body;
    updateData.updated_at = new Date();
    await content.update(updateData);

    // Update associations. Using '|| []' is a safe way to handle cases where arrays are not provided.
    await content.setGenres(genreIds || []);
    await content.setLanguages(languageIds || []);
    await content.setStreamingSources(streamingSourceIds || []);

    // Re-fetch the content to get the final, updated version with all associations.
    const updatedContent = await db.Content.findByPk(req.params.id, {
      include: [
        { model: db.Genre, as: 'genres', through: { attributes: [] } },
        { model: db.Language, as: 'languages', through: { attributes: [] } },
        { model: db.StreamingSource, as: 'streamingSources', through: { attributes: [] } }
      ]
    });

    res.status(200).json(updatedContent);

  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'One of the provided IDs is not valid.' });
    }
    console.error('[UPDATE CONTENT ERROR]', error);
    res.status(500).json({ message: 'Error while updating content.' });
  }
};

/**
 * Deletes a content item by its ID.
 * @param {object} req - The Express request object, containing the content ID as a parameter.
 * @param {object} res - The Express response object.
 * @async
 */
exports.deleteContent = async (req, res) => {
  try {
    const content = await db.Content.findByPk(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found.' });
    await content.destroy();
    res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('[DELETE CONTENT ERROR]', error);
    res.status(500).json({ message: 'Error while deleting content.' });
  }
};
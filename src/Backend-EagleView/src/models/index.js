/**
 * @fileoverview Centralized model and association definition file.
 * @author Diego Bugallo
 * @version 1.0.0
 * @description This file imports all individual Sequelize models, defines their
 * relationships (associations) like belongsTo, hasMany, and belongsToMany,
 * and exports them all as a single 'db' object. This acts as the central hub
 * for all database interactions within the application.
 */

// Archivo: src/models/index.js

const sequelize = require('../config/database');

// --- MODEL IMPORTS ---
const User = require('./User');
const Role = require('./Role');
const Content = require('./Content');
const Genre = require('./Genre');
const Rating = require('./Rating');
const Type = require('./Type');
const AgeRating = require('./AgeRating');
const Language = require('./Language');
const StreamingSource = require('./StreamingSource');

// --- DB OBJECT INITIALIZATION ---
const db = {
  sequelize, User, Role, Content, Genre, Rating, Type, AgeRating, Language, StreamingSource,
};

// --- ASSOCIATION DEFINITIONS ---

/**
 * Defines a many-to-many relationship between Users and Roles.
 * The 'user_roles' table serves as the join table.
 */
db.User.belongsToMany(db.Role, {
  through: 'user_roles',
  foreignKey: 'id_user',
  as: 'roles',
  timestamps: false
});
db.Role.belongsToMany(db.User, {
  through: 'user_roles',
  foreignKey: 'id_role',
  as: 'users',
  timestamps: false
});

/**
 * Defines the join table model for the User-Content favorites relationship.
 * Defining the model explicitly allows for more control, such as disabling timestamps.
 */
const UserFavorites = sequelize.define('user_favorites', {}, {
  schema: 'platform',
  timestamps: false
});

/**
 * Defines a many-to-many relationship between Users and Content for favorites.
 * A user can have many favorite content items, and a content item can be favorited by many users.
 */
db.User.belongsToMany(db.Content, {
  through: UserFavorites,
  foreignKey: 'id_user',
  as: 'favoriteContents'
});
db.Content.belongsToMany(db.User, {
  through: UserFavorites,
  foreignKey: 'id_content',
  as: 'favoritedByUsers'
});

/**
 * Defines a one-to-many relationship between Content and Type.
 * Each content item belongs to one type.
 */
db.Content.belongsTo(db.Type, { foreignKey: 'id_type', as: 'type' });
db.Type.hasMany(db.Content, { foreignKey: 'id_type', as: 'contents' });

/**
 * Defines a one-to-many relationship between Content and AgeRating.
 * Each content item has one age rating.
 */
db.Content.belongsTo(db.AgeRating, { foreignKey: 'id_age_rating', as: 'ageRating' });
db.AgeRating.hasMany(db.Content, { foreignKey: 'id_age_rating', as: 'contents' });

/**
 * Defines the join table model for the Content-Genre relationship.
 */
const ContentGenre = sequelize.define('content_genres', {}, { schema: 'platform', timestamps: false });
/**
 * Defines a many-to-many relationship between Content and Genre.
 */
db.Content.belongsToMany(db.Genre, { through: ContentGenre, foreignKey: 'id_content', as: 'genres' });
db.Genre.belongsToMany(db.Content, { through: ContentGenre, foreignKey: 'id_genre', as: 'contents' });

/**
 * Defines the join table model for the Content-Language relationship.
 */
const ContentLanguage = sequelize.define('content_languages', {}, { schema: 'platform', timestamps: false });
/**
 * Defines a many-to-many relationship between Content and Language.
 */
db.Content.belongsToMany(db.Language, { through: ContentLanguage, foreignKey: 'id_content', as: 'languages' });
db.Language.belongsToMany(db.Content, { through: ContentLanguage, foreignKey: 'id_language', as: 'contents' });

/**
 * Defines the join table model for the Content-StreamingSource relationship.
 */
const ContentStreamingSource = sequelize.define('content_streaming_sources', {}, { schema: 'platform', timestamps: false });
/**
 * Defines a many-to-many relationship between Content and StreamingSource.
 */
db.Content.belongsToMany(db.StreamingSource, { through: ContentStreamingSource, foreignKey: 'id_content', as: 'streamingSources' });
db.StreamingSource.belongsToMany(db.Content, { through: ContentStreamingSource, foreignKey: 'id_streaming_source', as: 'contents' });

/**
 * Defines the relationships for Ratings.
 * A rating belongs to one User and one Content item.
 * A User and a Content item can have many ratings.
 */
db.Rating.belongsTo(db.User, { foreignKey: 'id_user', as: 'user' });
db.User.hasMany(db.Rating, { foreignKey: 'id_user', as: 'ratings' });

db.Rating.belongsTo(db.Content, { foreignKey: 'id_content', as: 'content' });
db.Content.hasMany(db.Rating, { foreignKey: 'id_content', as: 'ratings' });

module.exports = db;
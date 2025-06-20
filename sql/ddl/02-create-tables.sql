-- ##################################################
-- #            DDL SCRIPT DOCUMENTATION            #
-- ##################################################
-- This script defines the database structure for a Content Streaming Platform.
-- It includes tables for managing users, roles, content (like movies or series),
-- genres, types, age ratings, languages, user preferences, and ratings within the 'platform' schema.
-- The schema is designed to ensure data integrity through normalization,
-- support efficient querying for content discovery, and manage user interactions.
-- Key entities include USERS, CONTENTS, and their various
-- categorizations and relationships, all hosted in the 'EagleView' database.
-- Primary Key IDs are defined as INTEGER and are NOT auto-incrementing.

-- ##################################################
-- #              TABLE DEFINITIONS                 #
-- ##################################################

-- Independent tables first

-- Table: platform.ROLES
-- Brief: Stores different user roles within the platform (e.g., admin, user).
CREATE TABLE IF NOT EXISTS platform.ROLES (
    id_role INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Table: platform.GENRES
-- Brief: Stores content genres (e.g., Action, Comedy, Drama).
CREATE TABLE IF NOT EXISTS platform.GENRES (
    id_genre INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: platform.TYPES
-- Brief: Stores types of content (e.g., Movie, Series).
CREATE TABLE IF NOT EXISTS platform.TYPES (
    id_type INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table: platform.AGE_RATINGS
-- Brief: Stores age ratings for content (e.g., PG-13, R).
CREATE TABLE IF NOT EXISTS platform.AGE_RATINGS (
    id_age_rating INTEGER PRIMARY KEY,
    abbreviation VARCHAR(10) NOT NULL 
);
-- Table: platform.LANGUAGES
-- Brief: Stores available languages for content or platform localization.
CREATE TABLE IF NOT EXISTS platform.LANGUAGES (
    id_language INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Dependent tables (referencing independent tables)

-- Table: platform.USERS
-- Brief: Stores user account information.
CREATE TABLE IF NOT EXISTS platform.USERS (
    id_user INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER,
    registration_date DATE NOT NULL
);

-- Table: platform.CONTENTS
-- Brief: Stores information about various content items like movies, series, etc.
CREATE TABLE IF NOT EXISTS platform.CONTENTS (
    id_content INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    id_type INTEGER NOT NULL,
    id_age_rating INTEGER NOT NULL,
    release_year INTEGER,
    duration VARCHAR(20),
    image_route VARCHAR(255),
    synopsis TEXT,
    calification_general DECIMAL(3,1),
    updated_at DATE NOT NULL
);

-- Junction / Transactional tables

-- Table: platform.USER_ROLES
-- Brief: Junction table linking users to their roles (Many-to-Many).
CREATE TABLE IF NOT EXISTS platform.USER_ROLES (
    id_user INTEGER NOT NULL,
    id_role INTEGER NOT NULL,
    PRIMARY KEY (id_user, id_role)
);

-- Table: platform.USER_PREFERRED_GENRES
-- Brief: Junction table linking users to their preferred genres (Many-to-Many).
CREATE TABLE IF NOT EXISTS platform.USER_PREFERRED_GENRES (
    id_user INTEGER NOT NULL,
    id_genre INTEGER NOT NULL,
    PRIMARY KEY (id_user, id_genre)
);

-- Table: platform.CONTENT_GENRES
-- Brief: Junction table linking content to its genres (Many-to-Many).
CREATE TABLE IF NOT EXISTS platform.CONTENT_GENRES (
    id_content INTEGER NOT NULL,
    id_genre INTEGER NOT NULL,
    PRIMARY KEY (id_content, id_genre)
);

-- Table: platform.CONTENT_LANGUAGES
-- Brief: Junction table linking content to available languages (Many-to-Many).
CREATE TABLE IF NOT EXISTS platform.CONTENT_LANGUAGES (
    id_content INTEGER NOT NULL,
    id_language INTEGER NOT NULL,
    PRIMARY KEY (id_content, id_language)
);

-- Table: platform.RATINGS
-- Brief: Stores ratings and comments provided by users for content items.
CREATE TABLE IF NOT EXISTS platform.RATINGS (
    id_rating INTEGER PRIMARY KEY, 
    id_user INTEGER NOT NULL,
    id_content INTEGER NOT NULL,
    stars INTEGER NOT NULL,
    comment TEXT,
    rating_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS platform.USER_FAVORITES (
    id_favorite SERIAL PRIMARY KEY, 
    id_user INTEGER NOT NULL,
    id_content INTEGER NOT NULL,
    added_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS platform.STREAMING_SOURCES (
    id_streaming_source INTEGER PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    logo_path VARCHAR(255)NOT NULL
);

CREATE TABLE IF NOT EXISTS platform.CONTENT_STREAMING_SOURCES (
    id_content_streaming SERIAL PRIMARY KEY,
    id_content INTEGER NOT NULL,
    id_streaming_source INTEGER NOT NULL
);


-- ##################################################
-- #            RELATIONSHIP DEFINITIONS            #
-- ##################################################

-- Relationships for CONTENTS
ALTER TABLE platform.CONTENTS ADD CONSTRAINT fk_contents_types
    FOREIGN KEY (id_type) REFERENCES platform.TYPES (id_type) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE platform.CONTENTS ADD CONSTRAINT fk_contents_ageratings
    FOREIGN KEY (id_age_rating) REFERENCES platform.AGE_RATINGS (id_age_rating) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Relationships for USER_ROLES
ALTER TABLE platform.USER_ROLES ADD CONSTRAINT fk_userroles_users
    FOREIGN KEY (id_user) REFERENCES platform.USERS (id_user) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.USER_ROLES ADD CONSTRAINT fk_userroles_roles
    FOREIGN KEY (id_role) REFERENCES platform.ROLES (id_role) ON UPDATE CASCADE ON DELETE CASCADE;

-- Relationships for USER_PREFERRED_GENRES
ALTER TABLE platform.USER_PREFERRED_GENRES ADD CONSTRAINT fk_userpreferred_users
    FOREIGN KEY (id_user) REFERENCES platform.USERS (id_user) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.USER_PREFERRED_GENRES ADD CONSTRAINT fk_userpreferred_genres
    FOREIGN KEY (id_genre) REFERENCES platform.GENRES (id_genre) ON UPDATE CASCADE ON DELETE CASCADE;

-- Relationships for CONTENT_GENRES
ALTER TABLE platform.CONTENT_GENRES ADD CONSTRAINT fk_contentgenres_contents
    FOREIGN KEY (id_content) REFERENCES platform.CONTENTS (id_content) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.CONTENT_GENRES ADD CONSTRAINT fk_contentgenres_genres
    FOREIGN KEY (id_genre) REFERENCES platform.GENRES (id_genre) ON UPDATE CASCADE ON DELETE RESTRICT; -- Prevent deleting a genre if content is tagged with it

-- Relationships for CONTENT_LANGUAGES
ALTER TABLE platform.CONTENT_LANGUAGES ADD CONSTRAINT fk_contentlanguages_contents
    FOREIGN KEY (id_content) REFERENCES platform.CONTENTS (id_content) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.CONTENT_LANGUAGES ADD CONSTRAINT fk_contentlanguages_languages
    FOREIGN KEY (id_language) REFERENCES platform.LANGUAGES (id_language) ON UPDATE CASCADE ON DELETE RESTRICT; -- Prevent deleting a language if content is tagged with it

-- Relationships for RATINGS
ALTER TABLE platform.RATINGS ADD CONSTRAINT fk_ratings_users
    FOREIGN KEY (id_user) REFERENCES platform.USERS (id_user) ON UPDATE CASCADE ON DELETE CASCADE; -- If user is deleted, their ratings are also deleted
ALTER TABLE platform.RATINGS ADD CONSTRAINT fk_ratings_contents
    FOREIGN KEY (id_content) REFERENCES platform.CONTENTS (id_content) ON UPDATE CASCADE ON DELETE CASCADE; -- If content is deleted, its ratings are also deleted


ALTER TABLE platform.USER_FAVORITES ADD CONSTRAINT uq_user_content_favorite UNIQUE (id_user, id_content);
ALTER TABLE platform.USER_FAVORITES ADD CONSTRAINT fk_favorites_users 
    FOREIGN KEY (id_user) REFERENCES platform.USERS (id_user) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.USER_FAVORITES ADD CONSTRAINT fk_favorites_contents
    FOREIGN KEY (id_content) REFERENCES platform.CONTENTS (id_content) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE platform.CONTENT_STREAMING_SOURCES ADD CONSTRAINT fk_content_streaming_contents
    FOREIGN KEY (id_content) REFERENCES platform.CONTENTS (id_content) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE platform.CONTENT_STREAMING_SOURCES ADD CONSTRAINT k_content_streaming_streaming_source
    FOREIGN KEY (id_streaming_source) REFERENCES platform.STREAMING_SOURCES (id_streaming_source) ON UPDATE CASCADE ON DELETE RESTRICT;

-- ##################################################
-- #               END DOCUMENTATION                #
-- ##################################################
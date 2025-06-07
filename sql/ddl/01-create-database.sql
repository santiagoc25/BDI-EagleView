-- 01. Create user
CREATE USER ev_admin WITH PASSWORD '#######################';
-- 02. Create database (with ENCODING= 'UTF8', TEMPLATE=Template 0, OWNER: fc_admin)
CREATE DATABASE EagleView WITH ENCODING='UTF8' LC_COLLATE='es_CO.UTF-8' LC_CTYPE='es_CO.UTF-8' TEMPLATE=template0 OWNER = ev_admin;
-- 03. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE EagleView TO ev_admin;
-- 04. Create Schema
CREATE SCHEMA IF NOT EXISTS platform AUTHORIZATION ev_admin;
-- 05. Comment on database
COMMENT ON DATABASE EagleView IS 'Base de datos para el sistema de plataforma de streaming de contenido';
-- 06. Comment of schema
COMMENT ON SCHEMA platform IS 'Esquema principal para el sistema de streaming de contenido';
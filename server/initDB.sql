-- Delete the table(s) if exists
DROP TABLE IF EXISTS users;

-- Create table(s)
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    -- Syntax for Postgres arrays
    preferences VARCHAR[]
);

-- Add initial data (if necessary)

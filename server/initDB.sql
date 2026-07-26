-- Delete the table(s) if exists
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;

-- Create table(s)
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    -- Syntax for Postgres arrays
    preferences VARCHAR[]
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    rating INT NOT NULL
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    rating INT NOT NULL,
    description TEXT,
    author_id VARCHAR(255),
    book_id INT,
    FOREIGN KEY(author_id) REFERENCES users(username),
    FOREIGN KEY(book_id) REFERENCES books(book_id)
);

-- Add initial data (if necessary)
INSERT INTO users VALUES(
    'test',
    -- "password=test"
    '098f6bcd4621d373cade4e832627b4f6',
    ARRAY['Fantasy']
);
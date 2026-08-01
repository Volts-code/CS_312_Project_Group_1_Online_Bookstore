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
    book_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    cover_img TEXT,
    description TEXT
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    rating INT NOT NULL,
    description TEXT,
    author_id VARCHAR(255),
    book_id VARCHAR(255),
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

INSERT INTO books VALUES
('the-hobbit', 'The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 4.8, 
    'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    'Bilbo Baggins is swept from his comfortable hobbit-hole into an adventure with thirteen dwarves and a wizard, bound for a mountain guarded by a dragon.'),
('circe', 'Circe', 'Madeline Miller', 'Historical Fiction', 4.2,
    'https://ia600505.us.archive.org/view_archive.php?archive=/35/items/l_covers_0014/l_covers_0014_41.zip&file=0014413118-L.jpg',
    'In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child--not powerful, like her father, nor viciously alluring like her mother.'),
('project-hail-mary', 'Project Hail Mary', 'Andy Weir', 'Science Fiction', 4.7,
    'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
    'A lone astronaut wakes without his memories and must solve an impossible scientific mystery to give humanity one last chance.'),
('the-thursday-murder-club', 'The Thursday Murder Club', 'Richard Osman', 'Mystery', 4.3,
    'https://covers.openlibrary.org/b/isbn/9781984880987-L.jpg',
    'Four clever residents of a retirement village meet weekly to investigate cold cases—until a real murder arrives on their doorstep.'),
('educated', 'Educated', 'Tara Westover', 'Memoir', 4.5,
    'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    'A woman raised in an isolated survivalist family recounts how education opened a path toward knowledge, independence, and a new understanding of home.'),
('the-midnight-library', 'The Midnight Library', 'Matt Haig', 'Contemporary Fiction', 4.1,
    'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    'Between life and death stands a library filled with alternate lives, offering Nora Seed the chance to discover what makes a life worth living.'),
('becoming', 'Becoming', 'Michelle Obama', 'Biography', 4.7,
    'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg',
    'Michelle Obama reflects on her childhood, career, family, and years in the White House with candor, warmth, and an invitation to keep becoming.'),
('the-song-of-achilles', 'The Song of Achilles', 'Madeline Miller', 'Romance', 4.6,
    'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg',
    'Patroclus recounts his bond with the legendary Achilles, from their youth together to the glory and tragedy awaiting them at Troy.');

INSERT INTO reviews (rating, description, author_id, book_id) VALUES
(5, 'Lyrical, romantic, and devastating even when you already know the ending.', 'test', 'the-song-of-achilles'),
(4, 'The mythology feels immediate because the emotional center is so human.', 'test', 'the-song-of-achilles'),
(5, 'Miller made an ancient story feel startlingly intimate.', 'test', 'the-song-of-achilles'),
(5, 'Thoughtful and personal, especially when she writes about ambition and family.', 'test', 'becoming'),
(4, 'The Chicago chapters were my favorite—grounded, vivid, and generous.', 'test', 'becoming'),
(5, 'It feels less like a victory lap and more like an honest conversation.', 'test', 'becoming'),
(4, 'A hopeful and accessible story about regret, choice, and small joys.', 'test', 'the-midnight-library'),
(4, 'The premise is simple, but several of Nora''s possible lives really stayed with me.', 'test', 'the-midnight-library'),
(3, 'A little direct with its message, though ultimately comforting.', 'test', 'the-midnight-library'),
(5, 'A difficult, clear-eyed memoir about the cost of becoming your own person.', 'test', 'educated'),
(4, 'Intense and beautifully written. I had to pause often to absorb it.', 'test', 'educated'),
(5, 'Her account of learning to trust her own memory is unforgettable.', 'test', 'educated'),
(4, 'Charming, twisty, and full of characters I would happily visit again.', 'test', 'the-thursday-murder-club'),
(5, 'The humor is gentle, but the mystery still has real bite.', 'test', 'the-thursday-murder-club'),
(4, 'A cozy mystery with a surprisingly moving view of friendship and age.', 'test', 'the-thursday-murder-club'),
(5, 'Big science, bigger heart. The central friendship made this one special.', 'test', 'project-hail-mary'),
(5, 'Every chapter ends with a new problem, and somehow the solutions stay fun.', 'test', 'project-hail-mary'),
(4, 'Some technical passages are dense, but the payoff is absolutely worth it.', 'test', 'project-hail-mary'),
(5, 'There''s nothing I love more than a book by a woman about a woman, so Circe certainly fits the bill.', 'test', 'circe'),
(4, 'This is the pièce de résistance I''ve been searching for my entire life. Not only did I fall in love with this story, I predict that this will be the best book I''ll read all year. This book is about healing and doing what it takes to come into your own.', 'test', 'circe'),
(5, 'This was one of the most amazing, beautiful, intricate, captivating books I have had the pleasure of reading in my entire life.', 'test', 'circe'),
(5, 'Warm, funny, and adventurous. It still feels like the perfect doorway into fantasy.', 'test', 'the-hobbit'),
(4, 'The songs slowed me down at first, but Bilbo''s growth won me over completely.', 'test', 'the-hobbit'),
(5, 'A wonderfully cozy quest with just the right amount of danger.', 'test', 'the-hobbit');
import express from "express";
import bodyParser from "body-parser"
import pg from "pg"
import md5 from "md5"
import cors from "cors"

//  USED FOR CONNECTING TO LOCAL DB
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookstoreDB",
    password: "*IK(OL8ik9ol",
    port: 5432
});

db.connect();
const app = express();
const port = 5000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CHANGE TO ACTUAL URL IN PROD
app.use( cors({
    origin: 'http://localhost:5173'
}));

///////////////// ENDPOINTS ///////////////////

// SIGNUP
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    const preferences = req.body.preferences;

    console.log(preferences);

    try {
        const response = await db.query(
            "INSERT INTO users VALUES ($1, $2, $3)",
            [username, password, preferences]
        );

        res.json({"success": true});
    }
    catch (error) {
        res.json({"success": false});
    } 
});

// LOGIN
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    try {
        const response = await db.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if( response.rows.length === 1 ){
            res.json({
                "success": true,
                "username": response.rows[0].username,
                "preferences": response.rows[0].preferences
            });
        }
        else{
            res.json({"success": false});
        }
    }
    catch (error){
        res.json({"success": false});
    }
});

// GET BOOK LIST
async function getBooks( preferences = [], numOfBooks = -1){
    let query = {};

    // if no preferences and no specified number of books, 
    //   get all books after specified book_id (default of 1)
    if( numOfBooks === -1 && preferences.length === 0 ){
        query = {
            statement: "SELECT * FROM books",
            parameters: []
        };
    }
    // if no specified number of books,
    //   get all books that match at least 1 specified preference after the specified book_id
    //   (default of 1)
    else if( numOfBooks === -1 ){
        query = {
            statement: "SELECT * FROM books WHERE genre = ANY($1)",
            parameters: [preferences]
        };
    }
    // if no specified preferences,
    //   get {numOfBooks} number of books, starting at startingBookId (default of 1)
    else if( preferences.length === 0 ){
        query = {
            statement: "SELECT * FROM books LIMIT $1",
            parameters: [numOfBooks]
        };
    }
    // get {numOfBooks} number of books that match the at least 1 specified preference
    //   starting at  startingBookId (default of 1)
    else{
        query = {
            statement: "SELECT * FROM books WHERE genre = ANY($1) LIMIT $2",
            parameters: [preferences, numOfBooks]
        };
    }

    try {
        const response = await db.query(
            query.statement,
            query.parameters
        );

        return {
            "success": true,
            "books": response.rows
        };
    }
    catch (error){
        return{"success": false};
    }
    
}

async function getBook( book_id ){
    try {
        const response = await db.query(
            "SELECT * FROM books WHERE book_id = $1",
            [book_id]
        );

        return {
            "success": true,
            "book": response.rows[0]
        };
    }
    catch (error){
        return {
            "success": false
        };
    }
}

app.get("/books", async (req, res) => {
    let preferences, numOfBooks, book_id;

    if( typeof req.body === 'undefined' ){
        preferences = [];
        numOfBooks = -1;
    }
    else{
        preferences = (
            typeof req.body.preferences === 'undefined' 
            ? []
            : req.body.preferences
        );
        numOfBooks = (
            typeof req.body.numOfBooks === 'undefined' 
            ? -1
            : req.body.numOfBooks
        );
        book_id = req.body.book_id;
    }
    if( typeof book_id !== 'undefined' ){
        const book = await getBook( book_id );

        res.json(book.book);
    }
    else{
        const books = await getBooks( preferences, numOfBooks );

        res.json(books.books);
    }
});

app.get("/book/:book_id", async (req, res) => {
    const book_id = req.params.book_id;

    const book = await getBook( book_id );

    res.json(book.book); 
});

// GET REVIEWS
function getRating( ratings ){
    const rating = ratings.reduce((total, current) => {
        return total + current.rating;
    }, 0);
    return Math.round(rating / ratings.length * 10) / 10;
}

app.get("/reviews/:book_id", async (req, res) => {
    const book_id = req.params.book_id;

    try {
        const allRatings = await db.query(
            "SELECT author_id, rating FROM reviews WHERE book_id = $1",
            [book_id]
        );
        const rating = getRating( allRatings.rows );

        const response = await db.query(
            "SELECT * FROM reviews WHERE book_id = $1",
            [book_id]
        );

        res.json({
            "success": true,
            "reviews": response.rows,
            "rating": rating
        });
    }
    catch (error) {
        res.json({"success": false});
    }
});

// ADD REVIEWS
app.post("/reviews", async (req, res) => {
    const book_id = req.body.book_id;
    const author_id = req.body.author_id;
    const rating = req.body.rating;
    const description = req.body.description;
    
    try {
        console.log(`${author_id} ${book_id}`);
        const exists = await db.query(
            "SELECT * FROM reviews WHERE author_id = $1 AND book_id = $2",
            [author_id, book_id]
        );
        
        let response;
        
        if( exists.rowCount === 0 ){
            console.log(`create: ${[rating, description, author_id, book_id]}`);
            response = await db.query(
                "INSERT INTO reviews (rating, description, author_id, book_id) VALUES ($1, $2, $3, $4)",
                [rating, description, author_id, book_id]
            );
        }
        else{
            console.log('update');
            response = await db.query(
                "UPDATE reviews SET rating = $1, description = $2 WHERE author_id = $3 AND book_id = $4",
                [rating, description, author_id, book_id]
            );
        }

        const reviews = await db.query(
            "SELECT rating FROM reviews WHERE book_id = $1",
            [book_id]
        );

        let bookRating = getRating( reviews.rows );
        console.log(bookRating);
        response = await db.query(
            "UPDATE books SET rating = $1 WHERE book_id = $2",
            [bookRating, book_id]
        );
        
        res.json({"success": true});
    }
    catch(error) {
        res.json({"success": false});
    }
});

// DELETE REVIEW
app.post("/delete_review", async (req, res) => {
    const review_id = req.body.review_id;
    const username = req.body.username;

    try {
        const response = await db.query(
            "DELETE FROM reviews WHERE review_id = $1 AND author_id = $2",
            [review_id, username]
        );

        res.json({"success": true});
    }
    catch (error) {
        res.json({"success": false});
    }
});

// UPDATE REVIEW
app.post("/update_review", async (req, res) => {
    const review_id = req.body.review_id;
    const username = req.body.username;
    const newRating = req.body.rating;
    const newDescription = req.body.description;

    try {
        const response = await db.query(
            "UPDATE reviews SET rating = $1, description = $2 WHERE review_id = $3 AND author_id = $4",
            [newRating, newDescription, review_id, username]
        );

        res.json({"success": true});
    }
    catch (error) {
        res.json({"success": false});
    }
})


///////////////// START SERVER /////////////////

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
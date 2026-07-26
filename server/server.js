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
async function getBooks( preferences = [], numOfBooks = -1, startingBookId = 1 ){
    let query = {};

    // if no preferences and no specified number of books, 
    //   get all books after specified book_id (default of 1)
    if( numOfBooks === -1 && preferences.length === 0 ){
        query = {
            statement: "SELECT * FROM books WHERE book_id >= $1",
            parameters: [startingBookId]
        };
    }
    // if no specified number of books,
    //   get all books that match at least 1 specified preference after the specified book_id
    //   (default of 1)
    else if( numOfBooks === -1 ){
        query = {
            statement: "SELECT * FROM books WHERE book_id >= $1 AND genre = ANY($2)",
            parameters: [startingBookId, preferences]
        };
    }
    // if no specified preferences,
    //   get {numOfBooks} number of books, starting at startingBookId (default of 1)
    else if( preferences.length === 0 ){
        query = {
            statement: "SELECT * FROM books WHERE book_id >= $1 LIMIT $2",
            parameters: [startingBookId, numOfBooks]
        };
    }
    // get {numOfBooks} number of books that match the at least 1 specified preference
    //   starting at  startingBookId (default of 1)
    else{
        query = {
            statement: "SELECT * FROM books WHERE book_id >= $1 AND genre = ANY($2) LIMIT $3",
            parameters: [startingBookId, preferences, numOfBooks]
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


app.get("/books", async (req, res) => {
    const preferences = (
        typeof req.body.preferences === 'undefined' 
        ? []
        : req.body.preferences
    );
    const startingId = (
        typeof req.body.startingId === 'undefined' 
        ? 1
        : req.body.startingId
    );
    const numOfBooks = (
        typeof req.body.numOfBooks === 'undefined' 
        ? -1
        : req.body.numOfBooks
    );

    return getBooks( preferences, numOfBooks, startingId );
});

// GET REVIEWS

///////////////// START SERVER /////////////////

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
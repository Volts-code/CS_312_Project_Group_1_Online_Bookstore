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

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    try {
        const response = await db.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );

        if( response.rows.length === 1 ){
            res.json({"success": true});
        }
        else{
            res.json({"success": false});
        }
    }
    catch (error){
        res.json({"success": false});
    }
});

///////////////// START SERVER /////////////////

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
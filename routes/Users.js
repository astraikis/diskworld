const express = require("express");
const sqlite3 = require("sqlite3");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secretKey = "verysecretkey";

// Connect to database
const db = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to database.")
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    db.all("SELECT * FROM users WHERE email = '" + email + "'", [], async (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            const user = rows[0];

            if (!user | !(await bcrypt.compare(password, user["passwrd"]))) {
                return res.status(401).send("Invalid login");
            }

            const token = jwt.sign({ "id": user["id"], "email": user["email"], "isAdmin": user["isAdmin"] }, secretKey, { expiresIn: "24h" });

            res.status(200);
            res.send({token});
        }
    });
});

router.post("/register", async (req, res) => { 
    const { name, email, password, admin } = req.body;

    let isAdmin = 0;
    if (admin === "on") {
        isAdmin = 1;
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const createdAt = Date.now();

    db.run(
        "INSERT INTO users (created, name, email, passwrd, isAdmin) VALUES (?, ?, ?, ?, ?)",
        [createdAt, name, email, hashedPassword, isAdmin],
        err => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send("User created");
            }
        }
    );
});

module.exports = router;
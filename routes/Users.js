const express = require("express");
const sqlite3 = require("sqlite3");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const utils = require("../utils");

const router = express.Router();

const secretKey = "verysecretkey";

/**
 * Sign in user.
 * Returns JWT.
 */
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        let qry = `SELECT * FROM users WHERE email = '${email}'`;
        let db = await utils.DBConnect();
        let user = await db.all(qry);
        user = user[0];

        if (!user | !(await bcrypt.compare(password, user["passwrd"]))) {
            return res.status(401).send("Invalid login");
        }

        const token = jwt.sign({ "id": user["id"], "email": user["email"], "isAdmin": user["isAdmin"] }, secretKey, { expiresIn: "24h" });

        res.status(200).send({token});
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to sign in user.")
    }
});

/**
 * Registers user.
 */
router.post("/register", async (req, res) => { 
    const { name, email, password, isAdmin } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const createdAt = Date.now();

    try {
        let qry = 
            "INSERT INTO users (created, name, email, passwrd, isAdmin) " +
            `VALUES (${createdAt}, '${name}', '${email}', '${hashedPassword}', ${isAdmin})`;
        let db = await utils.DBConnect();
        await db.exec(qry);
        res.status(200).send("Successfully registered user.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to register user.")
    }

    // db.run(
    //     "INSERT INTO users (created, name, email, passwrd, isAdmin) VALUES (?, ?, ?, ?, ?)",
    //     [createdAt, name, email, hashedPassword, isAdmin],
    //     err => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             res.status(200).send("User created");
    //         }
    //     }
    // );
});

module.exports = router;
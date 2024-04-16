const express = require("express");

const utils = require("../utils");

const router = express.Router();

/**
 * Get all categories.
 * No authorization required.
 */
router.get("/get-all", async (req, res) => {
    try {
        let qry = "SELECT name FROM categories";
        let db = await utils.DBConnect();
        const categories = await db.all(qry);
        res.status(200).send(categories);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get categories.");
    }
});

/**
 * Add category.
 * Admin authorization required.
 */
router.post("/add", utils.authenticateToken, async (req, res) => {
    if (req.user["isAdmin"] === 0) {
        return res.status(403).send("Unable to get orders. Requesting user is not admin.");
    }

    try {
        let qry = "SELECT * FROM categories";
        let db = await utils.DBConnect();
        const categories = await db.all(qry);
        const numCategories = categories.length;

        qry = `INSERT INTO categories (name, ordr) VALUES ('${req.body["category"]}', ${numCategories})`;
        await db.exec(qry);
        res.status(200).send("Category added.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to add category.");
    }
});

module.exports = router;
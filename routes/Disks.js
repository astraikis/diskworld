const express = require("express");
const fs = require("fs");

const utils = require("../utils");

const router = express.Router();

/**
 * Gets all disks.
 * No authorization required.
 */
router.get("/all", async (req, res) => {
    try {
        let qry = "SELECT * FROM PRODUCTS;";
        let db = await utils.DBConnect();
        let products = await db.all(qry);
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

/**
 * Get all disks from given category.
 * No authorization required.
 */
router.get("/category/:category", async (req, res) => {
    const cleanedCategory = req.params.category.replaceAll("+", " ");
    
    try {
        let qry = `SELECT * FROM PRODUCTS WHERE category = '${cleanedCategory}';`;
        let db = await utils.DBConnect();
        let products = await db.all(qry);
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

/**
 * Get featured disks.
 * No authorization required.
 */
router.get("/featured", async (req, res) => {
    try {
        let qry = "SELECT * FROM PRODUCTS WHERE featured = 1;";
        let db = await utils.DBConnect();
        let products = await db.all(qry);
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

/**
 * Get disk with id from url parameter.
 * No authorization required.
 */
router.get("/disk/:id", async (req, res) => {
    try {
        let qry = "SELECT * FROM PRODUCTS WHERE id = " + req.params.id + ";";
        let db = await utils.DBConnect();
        let product = await db.all(qry);
        res.status(200).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disk.");
    }
});

/**
 * Get disks with name like query from url parameters.
 * No authorization required.
 */
router.get("/search/:query", async (req, res) => {
    const query = "%" + req.params.query + "%";  
    try {
        let qry = "SELECT * FROM products WHERE name LIKE '" + query +"';";
        let db = await utils.DBConnect();
        const disks = await db.all(qry);
        res.status(200).send(disks);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

/**
 * Add disk.
 * Admin authorization required.
 */
router.post("/add", utils.authenticateToken, async (req, res) => {
    if (req.user["isAdmin"] === 0) {
        return res.status(403).send("Unable to get orders. Requesting user is not admin.");
    }
    
    try {
        let qry = `SELECT * FROM categories WHERE name = '${req.body["category"]}';`;
        let db = await utils.DBConnect();
        let categories = await db.all(qry);
        if (categories.length === 0) {
            return res.status(400).send("Unable to add disk.")
        }        

        qry = 
            "INSERT INTO products (name, description, image, price, category, featured) " +
            `VALUES ('${req.body["name"]}', '${req.body["description"]}', '${req.body["image"]}', ${req.body["price"]}, '${req.body["category"]}', ${req.body["featured"]});`;
        await db.exec(qry);

        qry = `SELECT id FROM products WHERE name = '${req.body["name"]}'`;
        let idRow = await db.all(qry);
        const id = idRow[0]["id"];
        
        // Make frontend files
        fs.readFile("./public/pages/disks/disk-template.html", "utf-8", (err, res) => {
            const htmlContents = res.replace(/{{id}}/g, id);
            fs.writeFile(`./public/pages/disks/${id}.html`, htmlContents, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                
                console.log("Successfully created HTML file.");
            });
        });

        fs.readFile("./public/pages/disks/disk-template.js", "utf-8", (err, res) => {
            const jsContents = res.replace(/"id"/g, id);
            fs.writeFile(`./public/scripts/disks/${id}.js`, jsContents, err => {
                if (err) {
                    console.log(err);
                    return;
                }
                
                console.log("Successfully created JS file.");
            });
        });

        res.status(200).send("Disk successfully added.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to add disk.");
    }
});

/**
 * Update disk.
 * Admin authorization required.
 */
router.put("/update", utils.authenticateToken, async (req, res) => {
    try {
        let qry = 
            `UPDATE products SET name = '${req.body["name"]}', description = '${req.body["description"]}'` +
            `, category = '${req.body["category"]}', image = '${req.body["image"]}'` + 
            `, price = ${req.body["price"]} WHERE id = ${req.body["id"]}`;
        let db = await utils.DBConnect();
        await db.exec(qry);

        res.status(200).send("Disk updated");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disk.");
    }
});

module.exports = router;
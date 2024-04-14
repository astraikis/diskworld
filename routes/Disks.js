const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const fs = require("fs");

const router = express.Router();

// Connect to database
// const db = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE, err => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Connected to database.")
//     }
// });

/**
 * Connects to SQLITE3 database.
 * 
 * @returns {Object} - Database object for connection.
 */
async function DBConnect() {
    const db = await sqlite.open({
        filename: 'main.db',
        driver: sqlite3.Database
    });
    return db;
}

router.get("/all", async (req, res) => {
    try {
        let qry = "SELECT * FROM PRODUCTS;";
        let db = await DBConnect();
        let products = await db.all(qry);
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

router.get("/featured", async (req, res) => {
    let db = await DBConnect();
    try {
        let qry = "SELECT * FROM PRODUCTS WHERE featured = 1;";
        let db = await DBConnect();
        let products = await db.all(qry);
        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

router.get("/disk/:id", async (req, res) => {
    let db = await DBConnect();
    try {
        let qry = "SELECT * FROM PRODUCTS WHERE id = " + req.params.id + ";";
        let db = await DBConnect();
        let product = await db.all(qry);
        res.status(200).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disk.");
    }
});

router.get("/search/:query", async (req, res) => {
    const query = "%" + req.params.query + "%";  
    try {
        let qry = "SELECT * FROM products WHERE name LIKE '" + query +"';";
        let db = await DBConnect();
        const disks = await db.all(qry);
        res.status(200).send(disks);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disks.");
    }
});

router.post("/add", async (req, res) => {
    try {
        let qry = 
            "INSERT INTO products (name, description, image, price, category, featured) " +
            `VALUES ('${req.body["name"]}', '${req.body["description"]}', '${req.body["image"]}', ${req.body["price"]}, '${req.body["category"]}', ${req.body["featured"]});`;
        let db = await DBConnect();
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
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to add disk.");
    }

    // db.run(
    //     "INSERT INTO products (name, description, image, price, category, featured) VALUES (?, ?, ?, ?, ?, ?)",
    //     [req.body["name"], req.body["description"], req.body["image"], req.body["price"], req.body["category"], req.body["featured"]],
    //     err => {
    //         if (err) {
    //             console.log(err);
    //             res.status(400);
    //             res.send("Unable to add product.")
    //         } else {
    //             // Get new disk id
    //             db.all("SELECT id FROM products WHERE name = '" + req.body["name"] + "'", [], (err, data) => {
    //                 if (err) {
    //                     console.log(err);
    //                     return;
    //                 }

    //                 console.log(data);

    //                 const id = data[0]["id"];

    //                 // Make frontend files
    //                 fs.readFile("./public/pages/disks/disk-template.html", "utf-8", (err, res) => {
    //                     const htmlContents = res.replace(/{{id}}/g, id);
    //                     fs.writeFile(`./public/pages/disks/${id}.html`, htmlContents, err => {
    //                         if (err) {
    //                             console.log(err);
    //                             return;
    //                         }
                            
    //                         console.log("Successfully created HTML file.");
    //                     });
    //                 });

    //                 fs.readFile("./public/pages/disks/disk-template.js", "utf-8", (err, res) => {
    //                     const jsContents = res.replace(/"id"/g, id);
    //                     fs.writeFile(`./public/scripts/disks/${id}.js`, jsContents, err => {
    //                         if (err) {
    //                             console.log(err);
    //                             return;
    //                         }
                            
    //                         console.log("Successfully created JS file.");
    //                     });
    //                 });
    //             });

    //             res.status(200);
    //             res.send("Successfully added product.")
    //         }
    //     }
    // );
});

router.put("/update", async (req, res) => {
    try {
        let qry = 
            `UPDATE products SET name = '${req.body["name"]}', description = '${req.body["description"]}'` +
            `, category = '${req.body["category"]}', image = '${req.body["image"]}'` + 
            `, price = ${req.body["price"]} WHERE id = ${req.body["id"]}`;
        let db = await DBConnect();
        await db.exec(qry);

        res.status(200).send("Disk updated");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get disk.");
    }
});

module.exports = router;
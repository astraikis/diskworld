const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const jwt = require("jsonwebtoken");

const router = express.Router();

const secretKey = "verysecretkey";

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

// Middleware for token verification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).send('Token required');
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
};

router.get("/get", authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        let qry = "SELECT * FROM users WHERE id = " + userId +";";
        let db = await DBConnect();
        let user = await db.all(qry);
        
        if (!user) {
            return res.status(403).send("No user credentials provided.");
        }

        qry = "SELECT id FROM carts WHERE user = " + userId + " AND status = 'new';";
        let cart = await db.all(qry);
        
        qry = "SELECT product FROM cartProducts WHERE cart = " + cart[0]["id"] + ";";
        let cartProductsRows = await db.all(qry);
        let cartProducts = [];
        
        for (let i = 0; i < cartProductsRows.length; i++) {
            qry = "SELECT * FROM products WHERE id = " + cartProductsRows[i]["product"] + ";";
            let product = await db.all(qry);
            cartProducts.push(product);
        }

        res.status(200).send({ id: cart[0]["id"], products: cartProducts });
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get cart.")
    }
});

router.post("/add", authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.body["id"];

    try {
        let qry = "SELECT * FROM carts WHERE user = " + userId + " AND status = 'new';";
        let db = await DBConnect();
        let cart = await db.all(qry);
        
        if (cart.length === 0) {
            const createdAt = Date.now();
            let qry = 
                'INSERT INTO carts ("status", "created", "user") ' +
                'VALUES ("new", ' + createdAt + ", " + userId + ");";
            await db.exec(qry);

            qry = "SELECT id FROM carts WHERE user = " + userId  + " AND status = 'new';";
            cart = await db.all(qry);
            const cartId = cart[0]["id"];
            
            qry = 
                'INSERT INTO cartProducts ("product", "quantity", "cart") ' +
                'VALUES (' + id + ', 1, ' + cartId + ");";
            await db.exec(qry);
            
            res.status(200).send({"message": "Successfully added to cart."});
        } else {
            const cartId = cart[0]["id"];
            
            qry = 
                'INSERT INTO cartProducts ("product", "quantity", "cart") ' +
                'VALUES (' + id + ', 1, ' + cartId + ");";
            await db.exec(qry);

            res.status(200).send({"message": "Successfully added to cart."});
        }

        await db.close();
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to add to cart.")
    }
});

router.delete("/remove", async (req, res) => {
    const { id, JWT } = req.body;
    const userId = jwt.decode(JWT)["id"];

    console.log(req.body);

    try {
        let qry = "SELECT id FROM carts WHERE user = " + userId + " AND status = 'new';";
        let db = await DBConnect();
        let cart = await db.all(qry);
        let cartId = cart[0]["id"];

        qry = "DELETE from cartProducts WHERE product = " + id + " AND cart = " + cartId + ";";
        db.exec(qry);

        res.status(200).send("Successfully removed from cart.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to remove from cart.")
    }
});

module.exports = router;
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

router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        let orderRes = [];

        let qry = "SELECT * FROM orders;";
        let db = await DBConnect();
        let orders = await db.all(qry);
        
        for (let i = 0; i < orders.length; i++) {
            order = {};
            order["created"] = orders[i]["created"];
            order["price"] = orders[i]["price"];
            order["user"] = orders[i]["user"];
            order["products"] = [];

            qry = "SELECT * FROM cartProducts WHERE cart = " + orders[i]["cart"] + ";";
            let products = await db.all(qry);
            
            for (let j = 0; j < products.length; j++) {
                let product = {};
                product["quantity"] = products[j]["quantity"];

                qry = "SELECT * FROM products WHERE id = " + products[j]["product"] + ";";
                let productRow = await db.all(qry);

                product["name"] = productRow[0]["name"];
                product["image"] = productRow[0]["image"];

                order["products"].push(product);
            }

            orderRes.push(order);
        }

        res.status(200).json(orderRes);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get orders.")
    }
});

router.get("/get-all/:JWT", async (req, res) => {
    const userId = jwt.decode(req.params.JWT)["id"];
    
    try {
        let orderRes = [];

        let qry = "SELECT * FROM orders WHERE user = " + userId + ";";
        let db = await DBConnect();
        let orders = await db.all(qry);
        
        for (let i = 0; i < orders.length; i++) {
            order = {};
            order["created"] = orders[i]["created"];
            order["price"] = orders[i]["price"];
            order["products"] = [];

            qry = "SELECT * FROM cartProducts WHERE cart = " + orders[i]["cart"] + ";";
            let products = await db.all(qry);
            
            for (let j = 0; j < products.length; j++) {
                let product = {};
                product["quantity"] = products[j]["quantity"];

                qry = "SELECT * FROM products WHERE id = " + products[j]["product"] + ";";
                let productRow = await db.all(qry);

                product["name"] = productRow[0]["name"];
                product["image"] = productRow[0]["image"];

                order["products"].push(product);
            }

            orderRes.push(order);
        }

        res.status(200).json(orderRes);
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to get orders.")
    }
});

router.post("/order", async (req, res) => {
    const { id, JWT, price } = req.body;
    const userId = jwt.decode(JWT)["id"];

    try {
        let qry = "SELECT * FROM carts WHERE id = " + id + ";";
        let db = await DBConnect();
        let cart = await db.all(qry);
        
        if (cart[0]["user"] !== userId) {
            return res.send(403).send("Invalid credentials for this cart.")
        }

        const createdAt = Date.now();

        qry = 
            'INSERT INTO orders ("user", "created", "price", "cart") ' +
            'VALUES (' + userId + ', ' + createdAt + ', ' + price + ", " + cart[0]["id"] + ');'
        await db.exec(qry);

        qry = 'UPDATE carts SET status = "purchased" WHERE id = ' + cart[0]["id"];
        await db.exec(qry);

        res.status(200).send("Successfully placed order.");
    } catch (err) {
        console.log(err);
        res.status(500).send("Unable to place order.")
    }
});

module.exports = router;
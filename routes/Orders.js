const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const jwt = require("jsonwebtoken");

const utils = require("../utils");

const router = express.Router();

/**
 * Gets orders for all users.
 * Admin authorization required.
 */
router.get("/get-all-orders", utils.authenticateToken, async (req, res) => {
    if (req.user["isAdmin"] === 0) {
        return res.status(403).send("Unable to get orders. Requesting user is not admin.");
    }

    try {
        let orderRes = [];

        let qry = "SELECT * FROM orders;";
        let db = await utils.DBConnect();
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
        res.status(500).send("Unable to get orders.");
    }
});

/**
 * Gets all orders for a user.
 * Authorization required.
 */
router.get("/get", utils.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    
    try {
        let orderRes = [];

        let qry = "SELECT * FROM orders WHERE user = " + userId + ";";
        let db = await utils.DBConnect();
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

/**
 * Places order.
 * Authorization required.
 */
router.post("/order", utils.authenticateToken, async (req, res) => {
    const { id, price } = req.body;
    const userId = req.user.id;

    try {
        let qry = "SELECT * FROM carts WHERE id = " + id + ";";
        let db = await utils.DBConnect();
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
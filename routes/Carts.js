const express = require("express");
const jwt = require("jsonwebtoken");

const utils = require("../utils");

const router = express.Router();

/**
 * Get current cart for user.
 * Authorization required.
 */
router.get("/get", utils.authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        let qry = "SELECT * FROM users WHERE id = " + userId +";";
        let db = await utils.DBConnect();
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

/**
 * Add disk to cart.
 * Authorization required.
 */
router.post("/add", utils.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.body["id"];

    try {
        let qry = "SELECT * FROM carts WHERE user = " + userId + " AND status = 'new';";
        let db = await utils.DBConnect();
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

/**
 * Remove disk from cart.
 */
router.delete("/remove", utils.authenticateToken, async (req, res) => {
    const id = req.body["id"];
    const userId = req.user.id;

    try {
        let qry = "SELECT id FROM carts WHERE user = " + userId + " AND status = 'new';";
        let db = await utils.DBConnect();
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
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

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

/**
 * Checks authenticity of JWT bearer token.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
        return res.status(401).send('Token required');
    }
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid or expired token');
        }
        req.user = user;
        next();
    });
};

module.exports = {
    DBConnect, authenticateToken
}
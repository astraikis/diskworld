const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const categoriesRoutes = require("./routes/Categories");
const cartsRoutes = require("./routes/Carts");
const disksRoutes = require("./routes/Disks");
const ordersRoutes = require("./routes/Orders");
const usersRoutes = require("./routes/Users");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/categories", categoriesRoutes);
app.use("/carts", cartsRoutes);
app.use("/disks", disksRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

// Start server
const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
    console.log("Listening on port " + PORT + "...");
});
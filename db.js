const mongoose = require("mongoose");

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://fathimaniska12_db_user:YKv95EzBFzWjzaIw@cluster0.bllbcso.mongodb.net/";

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

db.once("open", () => {
    console.log("Connected to MongoDB Atlas");
});

module.exports = db;

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Province = require("./models/Province");
const District = require("./models/District");
const Station = require("./models/Station");
const Vehicle = require("./models/Vehicle");
const Ping = require("./models/Ping");

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://fathimaniska12_db_user:YKv95EzBFzWjzaIw@cluster0.bllbcso.mongodb.net/";

const seedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "seed.json"), "utf8")
);

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    await Province.deleteMany({});
    await District.deleteMany({});
    await Station.deleteMany({});
    await Vehicle.deleteMany({});
    await Ping.deleteMany({});

    await Province.insertMany(seedData.provinces);
    await District.insertMany(seedData.districts);
    await Station.insertMany(seedData.stations);
    await Vehicle.insertMany(seedData.vehicles);
    await Ping.insertMany(seedData.pings);

    console.log("Seed data inserted successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
}

seed().catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
});

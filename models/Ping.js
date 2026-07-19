const mongoose = require("mongoose");

const pingSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    vehicle_id: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, required: true },
    timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Ping", pingSchema);

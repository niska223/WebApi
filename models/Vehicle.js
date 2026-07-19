const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    registration_number: { type: String, required: true },
    device_id: { type: String, required: true },
    station_id: { type: Number, required: true },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);

const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    district_id: { type: Number, required: true },
});

module.exports = mongoose.model("Station", stationSchema);

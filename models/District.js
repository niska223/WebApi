const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    province_id: { type: Number, required: true },
});

module.exports = mongoose.model("District", districtSchema);

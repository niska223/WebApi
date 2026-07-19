const express = require("express");
require("./db");

const Province = require("./models/Province");
const District = require("./models/District");
const Station = require("./models/Station");
const Vehicle = require("./models/Vehicle");
const Ping = require("./models/Ping");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        session: "NB6007CEM S2",
    });
});

// -------------------- Provinces --------------------

app.get("/provinces", async (req, res) => {
    const provinces = await Province.find();
    res.json(provinces);
});

app.get("/provinces/:provinceId", async (req, res) => {
    const provinceId = parseInt(req.params.provinceId);

    const province = await Province.findOne({ id: provinceId });

    if (!province) {
        return res.status(404).json({ message: "Province not found" });
    }

    res.json(province);
});

// -------------------- Districts --------------------

app.get("/districts", async (req, res) => {
    const districts = await District.find();
    res.json(districts);
});

app.get("/districts/:districtId", async (req, res) => {
    const districtId = parseInt(req.params.districtId);

    const district = await District.findOne({ id: districtId });

    if (!district) {
        return res.status(404).json({ message: "District not found" });
    }

    res.json(district);
});

// -------------------- Stations --------------------

app.get("/stations", async (req, res) => {
    const stations = await Station.find();
    res.json(stations);
});

app.get("/stations/:stationId", async (req, res) => {
    const stationId = parseInt(req.params.stationId);

    const station = await Station.findOne({ id: stationId });

    if (!station) {
        return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
});

// -------------------- Vehicles --------------------

app.get("/vehicles", async (req, res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
});

app.get("/vehicles/:vehicleId", async (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);

    const vehicle = await Vehicle.findOne({ id: vehicleId });

    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
});

app.get("/vehicles/:vehicleId/pings", async (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);

    const vehicle = await Vehicle.findOne({ id: vehicleId });

    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    const pings = await Ping.find({ vehicle_id: vehicleId });

    res.json(pings);
});

// -------------------- Device Keys --------------------

async function buildDeviceKeys() {
    const vehicles = await Vehicle.find();
    const deviceKeys = {};
    vehicles.forEach((v) => {
        const padded = String(v.id).padStart(2, "0");
        deviceKeys[`v-${padded}`] = `key_v${padded}`;
    });
    return deviceKeys;
}

// -------------------- POST /vehicles/:vehicleId/pings --------------------

app.post("/vehicles/:vehicleId/pings", async (req, res) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        return res.status(401).json({ message: "X-API-Key header is required" });
    }

    const vehicleId = parseInt(req.params.vehicleId);

    const vehicle = await Vehicle.findOne({ id: vehicleId });
    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    const deviceKeys = await buildDeviceKeys();
    const paddedId = `v-${String(vehicleId).padStart(2, "0")}`;
    if (!deviceKeys[paddedId] || apiKey !== deviceKeys[paddedId]) {
        return res.status(403).json({ message: "Invalid API key" });
    }

    const { latitude, longitude, speed } = req.body;
    if (latitude === undefined || longitude === undefined || speed === undefined) {
        return res.status(400).json({ message: "latitude, longitude, and speed are required" });
    }

    const lastPing = await Ping.findOne().sort({ id: -1 });
    const nextId = lastPing ? lastPing.id + 1 : 1;

    const ping = await Ping.create({
        id: nextId,
        vehicle_id: vehicleId,
        latitude,
        longitude,
        speed,
        timestamp: new Date(),
    });

    const location = `/vehicles/${vehicleId}/pings/${ping.id}`;
    res
        .status(201)
        .location(location)
        .set("ETag", `"${ping.id}"`)
        .set("Last-Modified", new Date(ping.timestamp).toUTCString())
        .json(ping);
});

// -------------------- GET /vehicles/:vehicleId/pings/:pingId --------------------

app.get("/vehicles/:vehicleId/pings/:pingId", async (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const pingId = parseInt(req.params.pingId);

    const vehicle = await Vehicle.findOne({ id: vehicleId });
    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    const ping = await Ping.findOne({ id: pingId, vehicle_id: vehicleId });
    if (!ping) {
        return res.status(404).json({ message: "Ping not found" });
    }

    res.json(ping);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

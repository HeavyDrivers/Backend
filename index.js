const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Location = require("./model/locationModel"); // Import the Location model
const { DateTime } = require("luxon"); //library for timezone conversion
var cors = require("cors");
const EngineLoad = require("./model/engineLoadModel");
const EngineCoolant = require("./model/engineCoolant");
const EngineRpm = require("./model/engineRpm");
const FuelLevel = require("./model/fuelLevel");
const Speed = require("./model/speed");
const ThrottlePos = require("./model/throttle");
const Temperature = require("./model/engineCoolant");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to your MongoDB database (replace 'mongodb://localhost/mydb' with your MongoDB connection string)
mongoose.connect(
  "mongodb+srv://rahulsharma4329:Rahul4329@cluster0.2cbpk2f.mongodb.net/LocationDb",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Working");
});

// Define an endpoint to save longitude and latitude
app.post("/save_location", async (req, res) => {
  try {
    // Extract latitude and longitude from the request body
    const { latitude, longitude, time } = req.body;

    // console.log(latitude);
    console.log(time);

    // Create a new Location document
    const location = new Location({
      latitude,
      longitude,
      time: new Date(time),
    });

    // Save the location data to the database
    await location.save();

    res.status(201).json({ message: "Location saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/fill_location", async (req, res) => {
  try {
    // Extract latitude and longitude from the request body
    const { latitude, longitude, time } = req.body;

    // console.log(latitude);
    console.log(time);

    // Create a new Location document
    const location = new Location({
      latitude,
      longitude,
      time: new Date(time),
    });

    // Save the location data to the database
    await location.save();

    res.status(201).json({ message: "Location saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get_engine_loads", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    const EngineLoads = await EngineLoad.find();

    res.json(EngineLoads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get_engine_coolant", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    const EngineCoolantTemp = await EngineCoolant.find();

    res.json(EngineCoolantTemp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/save_engine_coolant", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new EngineCoolant({ value: "12.21%" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get_locations", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const locations = await Location.find();

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//code for saving temperature data
app.post("/save_temperature", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new Temperature({ value: "0" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//code for fetching temperature data

app.get("/get_temperature", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const temperature = await Temperature.find();

    res.json(temperature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//code for fetching location between two time intervals
app.post("/get_locations_between", async (req, res) => {
  try {
    // Extract start and end timestamps from the request body
    const { startTime, endTime } = req.body;

    // Find locations that fall within the specified time interval
    const locations = await Location.find({
      time: { $gte: startTime, $lte: endTime },
    });

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//engineRpm post request

app.post("/save_engine_rpm", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new EngineRpm({ value: "12.21%" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetch engineRpm
app.get("/get_engine_rpm", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const engineRpm = await EngineRpm.find();

    res.json(engineRpm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//save throttle pos
app.post("/save_throttle_pos", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new ThrottlePos({ value: "12" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//fetch throttle pos
app.get("/get_throttle_pos", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const throttlePos = await ThrottlePos.find();

    res.json(throttlePos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// save fuel level
app.post("/save_fuel_load", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new FuelLevel({ value: "12.21%" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//fetch fuel level
app.get("/get_fuel_level", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const fuelLevel = await FuelLevel.find();

    res.json(fuelLevel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//save speed
app.post("/save_speed", async (req, res) => {
  try {
    // Fetch all engine load documents from the database
    let data = new Speed({ value: "1" });
    await data.save();
    // const engineLoads = await EngineLoad.save(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//fetch speed
app.get("/get_speed", async (req, res) => {
  try {
    // Fetch all location documents from the database
    const speed = await Speed.find();
    const prepspeed = speed.slice(0, 10);

    res.json(prepspeed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

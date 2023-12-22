const axios = require("axios");
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
const Temperature = require("./model/temperature");

const app = express();
const PORT = process.env.PORT || 3300;

//Ubidots API credential
const ubidotsToken = "BBUS-YnU2MPt4wREZM7PDROprW2xw05A8Zr";
const ubidotsLatVariableId = "lattitude";
const ubidotsLongVariableId = "longitude";
const ubidotsTempVariableId = "temperature";

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

// app.post("/save_latlong_ubi", async (req, res) => {
//   try {
//     // Assuming you have the Ubidots temperature variable ID in the request body

//     // Fetch temperature data from Ubidots
//     const ubidotsLatResponse = await fetchDataFromUbidots("latitude");
//     const ubidotsLongResponse = await fetchDataFromUbidots("longitude");

//     console.log(ubidotsLatResponse.data.results);
//     console.log(ubidotsLongResponse.data.results);

//     // Check if the 'results' property exists at the root level
//     // Check if the 'results' property exists at the root level for both latitude and longitude
//     if (
//       ubidotsLatResponse &&
//       ubidotsLatResponse.data &&
//       Array.isArray(ubidotsLatResponse.data.results) &&
//       ubidotsLongResponse &&
//       ubidotsLongResponse.data &&
//       Array.isArray(ubidotsLongResponse.data.results)
//     ) {
//       // Extract latitude and longitude values from the 'results' arrays
//       const latitudes = ubidotsLatResponse.data.results;
//       const longitudes = ubidotsLongResponse.data.results;

//       // Assuming both arrays have the same length
//       for (let i = 0; i < latitudes.length; i++) {
//         // Access the 'value' properties from the latitude and longitude data
//         const latitudeValue = latitudes[i].value;
//         const longitudeValue = longitudes[i].value;

//         // Create a new instance of the Location model (assuming you have a Location model)
//         const locationData = new Location({
//           latitude: Number(latitudeValue),
//           longitude: Number(longitudeValue),
//           time: new DateTime().toISOstring,
//         });
//         // Save the document to MongoDB
//         await locationData.save();
//       }

//       res.json({ message: "Temperature data saved successfully" });
//     } else {
//       // Handle the case where 'results' property is not present at the root level
//       res.status(500).json({ error: "Invalid Ubidots API response format" });
//     }
//   } catch (error) {
//     console.error(`Error in save_temp_from_ubi: ${error.message}`);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/get_tempfrom_ubi", async (req, res) => {
  try {
    // Assuming you have the Ubidots variable IDs in the request body
    const ubidotsTempVariableId = "temperature";
    const ubidotsLatitudeVariableId = "latitude";
    const ubidotsLongitudeVariableId = "longitude";
    const ubidotsRpmVariableId = "rpm";
    const ubidotsMaxAccelXVariableId = "maxaccel_x";
    const ubidotsMaxAccelYVariableId = "maxaccel_y";
    const ubidotsMaxAccelZVariableId = "maxaccel_z";
    const ubidotsMaxgyroX = "maxgyro_x_radps";
    const ubidotsMaxgyroY = "maxgyro_y_radps";
    const ubidotsMaxgyroZ = "maxgyro_z_radps";

    // Fetch data from Ubidots
    const tempResponse = await fetchDataFromUbidots(ubidotsTempVariableId);
    const latResponse = await fetchDataFromUbidots(ubidotsLatitudeVariableId);
    const longResponse = await fetchDataFromUbidots(ubidotsLongitudeVariableId);
    const rpmResponse = await fetchDataFromUbidots(ubidotsRpmVariableId);
    const maxAccelXResponse = await fetchDataFromUbidots(
      ubidotsMaxAccelXVariableId
    );
    const maxAccelYResponse = await fetchDataFromUbidots(
      ubidotsMaxAccelYVariableId
    );
    const maxAccelZResponse = await fetchDataFromUbidots(
      ubidotsMaxAccelZVariableId
    );
    const maxGyroXResponse = await fetchDataFromUbidots(ubidotsMaxgyroX);
    const maxGyroYResponse = await fetchDataFromUbidots(ubidotsMaxgyroY);
    const maxGyroZResponse = await fetchDataFromUbidots(ubidotsMaxgyroZ);

    // Check if the 'results' property exists at the root level for each response
    if (
      tempResponse &&
      Array.isArray(tempResponse.data.results) &&
      latResponse &&
      Array.isArray(latResponse.data.results) &&
      longResponse &&
      Array.isArray(longResponse.data.results) &&
      rpmResponse &&
      Array.isArray(rpmResponse.data.results) &&
      maxAccelXResponse &&
      Array.isArray(maxAccelXResponse.data.results) &&
      maxAccelYResponse &&
      Array.isArray(maxAccelYResponse.data.results) &&
      maxAccelZResponse &&
      Array.isArray(maxAccelZResponse.data.results) &&
      maxGyroXResponse &&
      Array.isArray(maxAccelXResponse.data.results) &&
      maxGyroYResponse &&
      Array.isArray(maxAccelYResponse.data.results) &&
      maxGyroZResponse &&
      Array.isArray(maxAccelZResponse.data.results)
    ) {
      // Extract data values from the respective 'results' arrays
      const temperatures = tempResponse.data.results;
      const latitudes = latResponse.data.results;
      const longitudes = longResponse.data.results;
      const rpms = rpmResponse.data.results;
      const maxAccelX = maxAccelXResponse.data.results;
      const maxAccelY = maxAccelYResponse.data.results;
      const maxAccelZ = maxAccelZResponse.data.results;
      const maxGyroX = maxGyroXResponse.data.results;
      const maxGyroY = maxGyroYResponse.data.results;
      const maxGyroZ = maxGyroZResponse.data.results;

      const latestData = [];

      // Iterate through each data point and store relevant information
      for (let i = 0; i < temperatures.length; i++) {
        const temperatureValue = temperatures[i].value;
        const latitudeValue = latitudes[i].value;
        const longitudeValue = longitudes[i].value;
        const rpmValue = rpms[i].value;
        const maxAccelXValue = maxAccelX[i].value;
        const maxAccelYValue = maxAccelY[i].value;
        const maxAccelZValue = maxAccelZ[i].value;
        const maxGyroXValue = maxGyroX[i].value;
        const maxGyroYValue = maxGyroY[i].value;
        const maxGyroZValue = maxGyroZ[i].value;

        latestData.push({
          temperature: temperatureValue,
          latitude: latitudeValue,
          longitude: longitudeValue,
          rpm: rpmValue,
          maxAccelX: maxAccelXValue,
          maxAccelY: maxAccelYValue,
          maxAccelZ: maxAccelZValue,
          maxGyroX: maxGyroXValue,
          maxGyroY: maxGyroYValue,
          maxGyroZ: maxGyroZValue,
        });
      }

      res.json(latestData);
    } else {
      // Handle the case where 'results' property is not present at the root level for any response
      res.status(500).json({ error: "Invalid Ubidots API response format" });
    }
  } catch (error) {
    console.error(`Error in get_data_from_ubi: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/save_tempfrom_ubi", async (req, res) => {
//   try {
//     // Assuming you have the Ubidots temperature variable ID in the request body
//     const ubidotsTempVariableId = "temperatures";

//     // Fetch temperature data from Ubidots
//     const ubidotsResponse = await fetchDataFromUbidots(ubidotsTempVariableId);
//     console.log(ubidotsResponse);

//     // Extract temperature values from the Ubidots API response
//     const temperatures = ubidotsResponse.results;

//     // Iterate through each temperature value and save it to MongoDB
//     for (const temperatureData of temperatures) {
//       // Create a new instance of the Temperature model
//       const data = new Temperature({
//         value: temperatureData.value,
//       });

//       // Save the document to MongoDB
//       await data.save();
//     }

//     res.json({ message: "Temperature data saved successfully" });
//   } catch (error) {
//     console.error(`Error in save_temp_from_ubi: ${error.message}`);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//Define an endpoints to save sensor data
app.post("/save_sensor_data", async (req, res) => {
  try {
    // Fetch latitude and longitude data from Ubidots
    const latData = await fetchUbidotsData(ubidotsLatVariableId);
    const longData = await fetchUbidotsData(ubidotsLongVariableId);

    // Combine latitude and longitude data into a single array of objects
    const locationData = combineLatLongData(latData, longData);

    // Extract other data parameters from the request body
    const { engineLoad, engineCoolant, time } = req.body;

    // Create and save documents for other individual sensor data
    const engineLoadData = new EngineLoad({ value: engineLoad });
    await engineLoadData.save();

    const engineCoolantData = new EngineCoolant({ value: engineCoolant });
    await engineCoolantData.save();

    // Save other sensor data...

    // Save combined location data to the database
    await Location.insertMany(locationData);

    // Prepare the packet of data for the frontend
    const dataPacket = {
      location: locationData,
      engineLoad: engineLoadData,
      engineCoolant: engineCoolantData,
      // Add other parameters...
    };

    // Send the data packet to the frontend
    res
      .status(201)
      .json({ message: "Sensor data saved successfully", data: dataPacket });
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

async function fetchDataFromUbidots(variableId) {
  // Replace 'your_ubidots_api_token_here' with your actual Ubidots API token
  const ubidotsApiToken = "BBUS-j56lhVLiFpd9MnZSun7nsnL5buiRXL";

  // Your Ubidots API URL
  const apiUrl = `https://industrial.api.ubidots.com/api/v1.6/devices/esp32/${variableId}/values`;
  let data = [];
  // Make the API request
  try {
    const response = axios.get(apiUrl, {
      headers: {
        "X-Auth-Token": ubidotsApiToken,
        // other headers...
      },
    });
    return response;
    // return response;
  } catch (error) {
    // Handle errors
    console.error("Error fetching data from Ubidots:", error.message);
  }
}

const timeThreshold = 1000;

// Function to check if timestamps are close within the defined threshold
function areTimestampsClose(timestamp1, timestamp2) {
  return Math.abs(timestamp1 - timestamp2) <= timeThreshold;
}

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
    // Extract latitude and longitude from the request body
    const { value } = req.body;

    // Create a new Location document
    const temperature = new Temperature({
      value,
    });

    // Save the location data to the database
    await temperature.save();

    res.status(201).json({ message: "Location saved successfully" });
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

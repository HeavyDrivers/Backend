const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Location = require("./Schema/location"); // Import the Location model

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

// Define an endpoint to save longitude and latitude
app.post("/save_location", async (req, res) => {
  try {
    // Extract latitude and longitude from the request body
    const { latitude, longitude, time, altitude } = req.body;

    // console.log(latitude);

    // Create a new Location document
    const location = new Location({ latitude, longitude, time, altitude });

    // Save the location data to the database
    await location.save();

    res.status(201).json({ message: "Location saved successfully" });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require("mongoose");

const fuelLevel = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const FuelLevel = mongoose.model("fuelLevel", fuelLevel);

module.exports = FuelLevel;

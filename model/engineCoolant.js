const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const Temperature = mongoose.model("Temperature", temperatureSchema);

module.exports = Temperature;

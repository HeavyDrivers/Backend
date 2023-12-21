const mongoose = require("mongoose");

const throttleSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const ThrottlePos = mongoose.model("ThrottlePos", throttleSchema);

module.exports = ThrottlePos;

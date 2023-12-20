const mongoose = require("mongoose");

const speedSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const Speed = mongoose.model("Speed", speedSchema);

module.exports = Speed;

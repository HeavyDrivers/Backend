const mongoose = require("mongoose");

const engineRpmSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const EngineRpm = mongoose.model("EngineRpm", engineRpmSchema);

module.exports = EngineRpm;

const mongoose = require("mongoose");

const engineCoolantSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const EngineCoolant = mongoose.model("EngineCoolant", engineCoolantSchema);

module.exports = EngineCoolant;

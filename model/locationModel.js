const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  time: Date,
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;

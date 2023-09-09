// location.js
const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;

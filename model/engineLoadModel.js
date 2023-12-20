// const mongoose = require("mongoose");

// const engineLoad = new mongoose.Schema({
//   value: String,
// });

// const EngineLoad = mongoose.model("engineLoad", engineLoad);

// module.exports = EngineLoad;

// engineLoadModel.js
const mongoose = require("mongoose");

const engineLoadSchema = new mongoose.Schema({
  value: String,
  // You can add other fields if needed
});

const EngineLoad = mongoose.model("EngineLoad", engineLoadSchema);

module.exports = EngineLoad;

const mongoose = require("mongoose");
const userId = mongoose.Schema({
  portal: {
    type: String,
    enum: ["Upwork", "PPH","GURU","LinkedIn","Email Marketing", "Appfutura","Freelancer","Codeur"],
    required: true,
  },
  id: { type: String, required: true},
});

module.exports = mongoose.model("userId", userId);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PasswordReset = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "auth",
  },
  token: {
    type: String,
    required: true,
  },
  resetPasswordExpires: {
    type: Date,
    default: Date.now,
    expires: 3600000,
  },
});

module.exports = mongoose.model("token", PasswordReset);
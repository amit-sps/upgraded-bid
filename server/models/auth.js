const mongoose = require("mongoose");
const authSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deleted:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("auth", authSchema);
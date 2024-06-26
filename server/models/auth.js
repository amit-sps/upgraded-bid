const mongoose = require("mongoose");
const Roles = require("../utils/roles");
const authSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: Roles.Invited,
      enum: [Roles.Admin, Roles.AmitOnly, Roles.BidOnly, Roles.Invited],
    },
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
    deleted: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("auth", authSchema);

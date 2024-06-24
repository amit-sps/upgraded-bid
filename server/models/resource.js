const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    coverImage: String,
    description: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;

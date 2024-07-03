const mongoose = require("mongoose");
const { PORTALS, BID_STATUS } = require("../utils/constant");
const AddBiddingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    portal: {
      type: String,
      enum: PORTALS,
      required: true,
    },

    technology: {
      type: [String],
      required: true,
    },

    team: {
      type: mongoose.Types.ObjectId,
      ref: "auth",
      required: true,
    },

    bidLink: {
      type: String,
      required: true,
      unique: true,
    },

    proposalLink: {
      type: String,
      required: true,
      unique: true,
    },

    bidStatus: {
      type: String,
      required: true,
      enum: Object.keys(BID_STATUS).map((key) => BID_STATUS[key]),
      default: BID_STATUS.Submitted,
    },

    connect: {
      type: Number,
      default: 0,
    },

    bidder: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "auth",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bidding", AddBiddingSchema);

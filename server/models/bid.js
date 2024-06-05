const mongoose = require("mongoose");
const AddBiddingSchema = mongoose.Schema(
  {
    IdUsed: {
      type: String,
      default: null,
    },
    idUsedForBid: {
      type: mongoose.Types.ObjectId,
      ref: "userId",
      required: true,
    },
    JobTitle: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: null,
    },
    nameofbidder: {
      type: String,
      default: null,
    },
    bidderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "auth",
    },
    department: {
      type: String,
      required: true,
      enum: ["OST","BED","JST","SI","LAMP", "MED", "SDM", "MSS", "SI","DTX","DevOps"],
    },
    portal: {
      type: String,
      enum: ["Upwork", "PPH","GURU","LinkedIn","Email Marketing", "Appfutura","Freelancer","Codeur"],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Job Submitted", "Response Received", "Scrapped", "Converted"],
      default: "Job Submitted",
    },
    connect: {
      type: Number,
      default: 0,
    },
    jobLink: {
      type: String,
      required: true,
      unique: true,
    },
    technology: {
      type: String,
      required: true,
    },
    bidType:{
      type:String,
      required: true,
      enum:["Bid","Invite","Email Marketing"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bidding", AddBiddingSchema);

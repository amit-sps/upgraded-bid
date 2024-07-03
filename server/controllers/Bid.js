const Bidding = require("../models/bid");
const mongoose = require("mongoose");
const moment = require("moment");
const { validationResult } = require("express-validator");
const teamModel = require("../models/team");
const logger = require("../utils/winston.util");
const Roles = require("../utils/roles");
const { FULL_STACK_SKILLS, BID_STATUS } = require("../utils/constant");
const auth = require("../models/auth");
const resourceModal = require("../models/resource");

exports.addBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const result = await Bidding.create({
      team: req.body.team,
      title: req.body.title,
      proposalLink: req.body.proposalLink,
      bidder: req.user._id,
      portal: req.body.portal,
      bidStatus: req.body.bidStatus,
      connect: req.body.connect,
      bidLink: req.body.bidLink,
      technology: req.body.technology,
      bidType: req.body.bidType,
    });

    if (result._id) {
      return res.status(201).json({ message: "Bid added successfully." });
    }

    return res.status(400).json({ message: "Something went wrong." });
  } catch (ex) {
    logger.error(ex.message);
    return res.status(500).send({ message: "Internal server error." });
  }
};

exports.getBid = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { pageCount } = req.query;
    const query = buildQuery(req);

    let bids;
    let count;

    if (pageCount) {
      const pageSize = 10;
      const skip = (parseInt(pageCount) - 1) * pageSize;
      bids = await getBids(query, skip);
      count = await getCount(query);
    } else {
      bids = await getBids(query, null);
      count = await getCount(query);
    }

    return res.json({ bids, count });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server issue." });
  }
};

const buildQuery = (req) => {
  const { startDate, endDate, status, bidType, search } = req.query;
  const query = {};
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (status) {
    query.status = status;
  }
  if (bidType) {
    query.bidType = bidType;
  }
  const {
    user: { _id: userId, role },
  } = req;

  if (!role === Roles.Admin || !role === Roles.AmitOnly) {
    query.bidderId = userId;
  }

  if (search) {
    query["$or"] = [
      { title: { $regex: search, $options: "i" } },
      { bidLink: { $regex: search, $options: "i" } },
      { "bidder.name": { $regex: search, $options: "i" } },
      { "team.name": { $regex: search, $options: "i" } },
    ];
  }

  return query;
};

const getBids = async (query, skip) => {
  try {
    const aggregationPipeline = [
      {
        $lookup: {
          from: auth.collection.name,
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $unwind: {
          path: "$team",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: auth.collection.name,
          localField: "bidder",
          foreignField: "_id",
          as: "bidder",
        },
      },
      {
        $unwind: {
          path: "$bidder",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: query },
      {
        $sort: { createdAt: -1 },
      },
      ...(skip !== null ? [{ $skip: skip }, { $limit: 10 }] : []),
      {
        $limit: 10,
      },

      {
        $project: {
          "bidder._id": 1,
          "bidder.name": 1,
          "bidder.username": 1,
          "bidder.email": 1,
          "team._id": 1,
          "team.name": 1,
          "team.username": 1,
          "team.email": 1,
          "team.skills": 1,
          title: 1,
          proposalLink: 1,
          bidStatus: 1,
          createdAt: 1,
          portal: 1,
          bidLink: 1,
          technology: 1,
          updatedAt: 1,
          connect: 1,
        },
      },
    ];
    return await Bidding.aggregate(aggregationPipeline);
  } catch (error) {
    console.log(error);
  }
};

const getCount = async (query) => {
  return await Bidding.find(query).count();
};

exports.getBidById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    let id = mongoose.Types.ObjectId(req.params.id);
    let bids = await Bidding.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: auth.collection.name,
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $unwind: {
          path: "$team",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: auth.collection.name,
          localField: "bidder",
          foreignField: "_id",
          as: "bidder",
        },
      },
      {
        $unwind: {
          path: "$bidder",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "bidder._id": 1,
          "bidder.name": 1,
          "bidder.username": 1,
          "bidder.email": 1,
          "team._id": 1,
          "team.name": 1,
          "team.username": 1,
          "team.email": 1,
          "team.skills": 1,
          title: 1,
          proposalLink: 1,
          bidStatus: 1,
          createdAt: 1,
          portal: 1,
          bidLink: 1,
          technology: 1,
          updatedAt: 1,
          connect: 1,
        },
      },
    ]);
    res.status(200).send(bids[0]);
  } catch (ex) {
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.editBidById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  console.log("Hereeeeeeeeeeeeeee.");
  try {
    const id = req.params.id;
    Bidding.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      },
      function (err, data) {
        if (!err) {
          res.status(201).json({
            bid: data,
          });
        } else {
          res.status(500).json({
            message: "Not found any relative data.",
          });
        }
      }
    );
  } catch (ex) {
    logger.error(ex.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

// exports.searchByValue = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     logger.error(errors.array());
//     return res.status(422).json({
//       success: false,
//       errors: errors.array(),
//     });
//   }

//   const {
//     user: { _id: userId, isAdmin },
//   } = req;
//   let { pageCount, value } = req.query;
//   if (pageCount == 0) {
//     pageCount = 1;
//   }
//   const skip = (pageCount - 1) * 10;
//   let count
//   if (isAdmin) {
//     try {
//       count = await Bidding.find({
//         $or: [
//           { JobTitle: { $regex: value, $options: "i" } },
//           { nameofbidder: { $regex: value, $options: "i" } },
//           { jobLink: { $regex: value, $options: "i" } },
//           { IdUsed: { $regex: value, $options: "i" } },
//         ]
//       }).countDocuments()
//       const searchedValues = await Bidding.find({
//         $or: [
//           { JobTitle: { $regex: value, $options: "i" } },
//           { nameofbidder: { $regex: value, $options: "i" } },
//           { jobLink: { $regex: value, $options: "i" } },
//           { IdUsed: { $regex: value, $options: "i" } },
//         ],
//       }).sort({createdAt:-1}).limit(10).skip(skip)
//       return res
//         .status(200)
//         .json({ bids: searchedValues.reverse(), count });
//     } catch (ex) {
//       return res.status(500).send({ message: "Internal server error" });
//     }
//   } else {
//     try {
//       count = await Bidding.find({bidderId: userId, $or: [
//         { JobTitle: { $regex: value, $options: "i" } },
//         { nameofbidder: { $regex: value, $options: "i" } },
//         { jobLink: { $regex: value, $options: "i" } },
//         { IdUsed: { $regex: value, $options: "i" } },
//       ],}).countDocuments()

//       let bidding = await Bidding.find({
//         bidderId: userId,
//         $or:[
//           { jobLink: { $regex: value, $options: "i" } },
//           { nameofbidder: { $regex: value, $options: "i" } },
//           { IdUsed: { $regex: value, $options: "i" } },
//           { JobTitle: { $regex: value, $options: "i" } },
//         ]
//       }).sort({createdAt:-1}).limit(10).skip(skip)
//       return res.status(200).send({ bids: bidding, count});
//     } catch (err) {
//       logger.error(err.message);
//       return res.status(500).send({ message: "Internal server error" });
//     }
//   }
// };

exports.searchByValue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }

  const {
    user: { _id: userId, isAdmin },
  } = req;
  let { pageCount, value } = req.query;
  if (pageCount == 0) {
    pageCount = 1;
  }
  const skip = (pageCount - 1) * 10;
  let count;
  if (isAdmin) {
    try {
      count = await Bidding.find({
        $or: [
          { JobTitle: { $regex: value, $options: "i" } },
          { nameofbidder: { $regex: value, $options: "i" } },
          { jobLink: { $regex: value, $options: "i" } },
          { IdUsed: { $regex: value, $options: "i" } },
        ],
      }).countDocuments();
      const searchedValues = await Bidding.aggregate([
        {
          $match: {
            $or: [
              { JobTitle: { $regex: value, $options: "i" } },
              { nameofbidder: { $regex: value, $options: "i" } },
              { jobLink: { $regex: value, $options: "i" } },
              { IdUsed: { $regex: value, $options: "i" } },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: skip },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: teamModel.collection.name,
            localField: "idUsedForBid",
            foreignField: "_id",
            as: "userIds",
          },
        },
        {
          $unwind: {
            path: "$userIds",
          },
        },
        {
          $project: {
            IdUsed: "$userIds.id",
            JobTitle: 1,
            URL: 1,
            username: 1,
            nameofbidder: 1,
            status: 1,
            connect: 1,
            createdAt: 1,
            portal: 1,
            department: 1,
            jobLink: 1,
            technology: 1,
            idUsedForBid: 1,
            bidderId: 1,
            updatedAt: 1,
            bidType: 1,
          },
        },
      ]);
      return res.status(200).json({ bids: searchedValues.reverse(), count });
    } catch (ex) {
      return res.status(500).send({ message: "Internal server error." });
    }
  } else {
    try {
      count = await Bidding.find({
        bidderId: userId,
        $or: [
          { JobTitle: { $regex: value, $options: "i" } },
          { nameofbidder: { $regex: value, $options: "i" } },
          { jobLink: { $regex: value, $options: "i" } },
          { IdUsed: { $regex: value, $options: "i" } },
        ],
      }).countDocuments();

      const bidding = await Bidding.aggregate([
        {
          $match: {
            bidderId: userId,
            $or: [
              { JobTitle: { $regex: value, $options: "i" } },
              { nameofbidder: { $regex: value, $options: "i" } },
              { jobLink: { $regex: value, $options: "i" } },
              { IdUsed: { $regex: value, $options: "i" } },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: skip },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: teamModel.collection.name,
            localField: "idUsedForBid",
            foreignField: "_id",
            as: "userIds",
          },
        },
        {
          $unwind: {
            path: "$userIds",
          },
        },
        {
          $project: {
            IdUsed: "$userIds.id",
            JobTitle: 1,
            URL: 1,
            username: 1,
            nameofbidder: 1,
            status: 1,
            connect: 1,
            createdAt: 1,
            portal: 1,
            department: 1,
            jobLink: 1,
            technology: 1,
            idUsedForBid: 1,
            bidderId: 1,
            updatedAt: 1,
            bidType: 1,
          },
        },
      ]);
      return res.status(200).send({ bids: bidding, count });
    } catch (err) {
      logger.error(err.message);
      return res.status(500).send({ message: "Internal server error." });
    }
  }
};

exports.dashboardCount = async function (req, res) {
  try {
    const date = new Date();
    const todayDate = date.setHours(0, 0, 0, 0);

    // Use Promise.all to execute queries concurrently
    const [
      totalBidding,
      todayBidding,
      scrappedBid,
      convertedBid,
      respondedBid,
      totalResources,
      yourResources,
    ] = await Promise.all([
      Bidding.countDocuments({}),
      Bidding.countDocuments({ createdAt: { $gte: todayDate } }),
      Bidding.countDocuments({ bidStatus: BID_STATUS.Scrapped }),
      Bidding.countDocuments({ bidStatus: BID_STATUS.Converted }),
      Bidding.countDocuments({ bidStatus: BID_STATUS.Responded }),
      resourceModal.countDocuments({}),
      resourceModal.countDocuments({ postedBy: req.user._id }),
    ]);

    return res.json({
      message: "Bidding data retrieved successfully",
      data: {
        todayBidding,
        totalBidding,
        scrappedBid,
        convertedBid,
        totalResources,
        yourResources,
        respondedBid,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving bidding data",
      error: error.message,
    });
  }
};

// exports.userBids = async function (req, res) {
//   try {
//     const Bid = await Bidding.aggregate([
//       {
//         $group: {
//           _id: { nameofbidder: "$nameofbidder" },
//           totalBidNo: { $sum: 1 },
//         },
//       },
//     ]);
//     let count = "";
//     for (let i = 0; i < Bid.length; i++) {
//       count = await Bidding.countDocuments({
//         status: "Response Recieved",
//         nameofbidder: Bid[i]._id.nameofbidder,
//       });
//       Bid[i].totalResponseNo = count;
//     }
//     res.status(200).json({ Bid });
//   } catch (ex) {
//     logger.error(ex.message);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

exports.userBids = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    let { status, startDate, endDate } = req.query;
    let bidQuery = {};
    if (status) {
      bidQuery.bidStatus = status;
    }
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      endDate.setHours(endDate.getHours() + 23);
      bidQuery.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (status && startDate && endDate) {
      bidQuery = {
        bidStatus: status,
        createdAt: { $gte: startDate, $lte: endDate },
      };
    }

    const result = await auth.aggregate([
      {
        $lookup: {
          from: Bidding.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$bidder", "$$userId"] },
                ...bidQuery,
              },
            },
          ],
          as: "bids",
        },
      },
      {
        $lookup: {
          from: resourceModal.collection.name,
          localField: "_id",
          foreignField: "postedBy",
          as: "resources",
        },
      },
      {
        $project: {
          nameOfBidder: "$name",
          totalNumberOfBid: { $size: "$bids" },
          totalNumberOfResources: { $size: "$resources" },
        },
      },
      {
        $match: {
          $or: [
            { totalNumberOfBid: { $gt: 0 } },
            { totalNumberOfResources: { $gt: 0 } },
          ],
        },
      },
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (ex) {
    logger.error(ex.message);
    res.status(500).send({ message: "Internal server error." });
  }
};

exports.getAllPortalRecords = async function (req, res) {
  try {
    const {
      user: { _id: userId },
    } = req;
    const data = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = req.query.year ? req.query.year : new Date().getFullYear();
    for (let i = 1; i <= 12; i++) {
      let startDate = `${year}-${i}-01`;
      startDate = new Date(startDate);
      let month = startDate.getMonth();
      let lastDayOfMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
      const Upwork = await Bidding.find({
        bidderId: userId,
        portal: "Upwork",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      const Guru = await Bidding.find({
        bidderId: userId,
        portal: "GURU",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      const PPH = await Bidding.find({
        bidderId: userId,
        portal: "PPH",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      const Linkedin = await Bidding.find({
        bidderId: userId,
        portal: "LinkedIn",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      const Email_Marketing = await Bidding.find({
        bidderId: userId,
        portal: "Email Marketing",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      const Appfutura = await Bidding.find({
        bidderId: userId,
        portal: "Appfutura",
        createdAt: { $gte: startDate, $lte: lastDayOfMonth },
      }).countDocuments();
      data.push({
        name: monthNames[month],
        Upwork,
        Guru,
        PPH,
        Linkedin,
        Appfutura,
        EmailMarketing: Email_Marketing,
      });
    }
    return res.json({ data });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getBidsWithoutPagination = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    let { startDate, endDate, status, bidType } = req.query;
    let query = {};
    const {
      user: { _id: userId, isAdmin },
    } = req;
    let bids, count;
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      endDate.setHours(endDate.getHours() + 23);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (status) {
      query.status = status;
    }
    if (bidType) {
      query.bidType = bidType;
    }
    if (startDate && endDate && status) {
      query.createdAt = { $gte: startDate, $lte: endDate };
      query.status = status;
    }
    if (startDate && endDate && bidType) {
      query.createdAt = { $gte: startDate, $lte: endDate };
      query.bidType = bidType;
    }
    if (status && bidType) {
      query.status = status;
      query.bidType = bidType;
    }
    if (isAdmin) {
      bids = await Bidding.aggregate([
        { $match: query },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: teamModel.collection.name,
            localField: "idUsedForBid",
            foreignField: "_id",
            as: "userIds",
          },
        },
        {
          $unwind: {
            path: "$userIds",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            IdUsed: "$userIds.id",
            JobTitle: 1,
            URL: 1,
            username: 1,
            nameofbidder: 1,
            status: 1,
            createdAt: 1,
            portal: 1,
            department: 1,
            jobLink: 1,
            technology: 1,
            idUsedForBid: 1,
            bidderId: 1,
            updatedAt: 1,
            connect: 1,
            bidType: 1,
          },
        },
      ]);
      count = await Bidding.find(query).count();
    } else {
      query.bidderId = userId;
      bids = await Bidding.aggregate([
        { $match: query },
        {
          $lookup: {
            from: teamModel.collection.name,
            localField: "idUsedForBid",
            foreignField: "_id",
            as: "userIds",
          },
        },
        {
          $unwind: {
            path: "$userIds",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            IdUsed: "$userIds.id",
            JobTitle: 1,
            URL: 1,
            username: 1,
            nameofbidder: 1,
            status: 1,
            createdAt: 1,
            portal: 1,
            department: 1,
            jobLink: 1,
            technology: 1,
            idUsedForBid: 1,
            bidderId: 1,
            updatedAt: 1,
            connect: 1,
            bidType: 1,
          },
        },
      ]);
      count = await Bidding.find(query).count();
    }
    return res.json({ bids, count });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server issue." });
  }
};

exports.getBidTable = async (req, res) => {
  try {
    let todayDate = new Date();
    let todayStartTime = new Date(todayDate.setUTCHours(0, 0, 0, 0));
    let todayEndTime = new Date(todayDate.setUTCHours(23, 59, 59, 999));

    let yesturdayDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    let yesturdayStartTime = new Date(yesturdayDate.setUTCHours(0, 0, 0, 0));
    let yesturdayEndTime = new Date(yesturdayDate.setUTCHours(23, 59, 59, 999));

    const users = await Bidding.aggregate([
      {
        $group: {
          _id: "$username",
        },
      },
      {
        $project: {
          username: "$_id",
          _id: 0,
        },
      },
    ]);

    let userBids = [];
    for (let user of users) {
      const { username } = user;
      let submittedBids = await Bidding.find({
        status: "Job Submitted",
        username,
      }).countDocuments();
      let yesturdayBids = await Bidding.find({
        createdAt: { $gte: yesturdayStartTime, $lte: yesturdayEndTime },
        username,
      }).countDocuments();
      let convertedBids = await Bidding.find({
        status: "Converted",
        username,
      }).countDocuments();
      let todayBids = await Bidding.find({
        createdAt: { $gte: todayStartTime, $lte: todayEndTime },
        username,
      }).countDocuments();
      let totalBids = await Bidding.find({ username }).countDocuments();

      let userData = {
        username,
        todayBids,
        yesturdayBids,
        convertedBids,
        submittedBids,
        totalBids,
      };
      userBids.push(userData);
    }

    return res.json({ userBids });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllSKills = async (_req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "Skills fetch successfully.", data: FULL_STACK_SKILLS });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getBidderTeamBySkills = async (req, res) => {
  try {
    const { skills } = req.query;
    let pipeline = [];

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(",");
      logger.info(`Fetching teams with skills: ${skillsArray.join(", ")}`);

      pipeline = [
        { $match: { skills: { $in: skillsArray } } },
        {
          $addFields: {
            matchingSkillCount: {
              $size: { $setIntersection: ["$skills", skillsArray] },
            },
          },
        },
        { $sort: { matchingSkillCount: -1 } },
      ];
    } else {
      logger.info("Fetching all teams sorted by highest skills");

      pipeline = [
        { $addFields: { skillCount: { $size: "$skills" } } },
        { $sort: { skillCount: -1 } },
      ];
    }

    pipeline.push({
      $project: {
        _id: 1,
        username: 1,
        skills: 1,
        name: 1,
        email: 1,
      },
    });

    const teams = await auth.aggregate(pipeline);

    return res
      .status(200)
      .json({ message: "Teams fetched successfully.", data: teams || [] });
  } catch (error) {
    logger.error(`Error fetching teams: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const Bidding = require("../models/bid");
const mongoose = require("mongoose");
const moment = require("moment");
const { validationResult } = require("express-validator");
const userIdModel = require("../models/team");
const logger = require("../utils/winston.util");

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
      idUsedForBid: req.body.IdUsed,
      JobTitle: req.body.JobTitle,
      URL: req.body.URL,
      username: req.user.username,
      nameofbidder: req.user.name,
      bidderId: req.user._id,
      department: req.body.department,
      portal: req.body.portal,
      status: req.body.status,
      connect: req.body.connect,
      jobLink: req.body.jobLink,
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
    user: { _id: userId, isAdmin },
  } = req;

  if (!isAdmin) {
    query.bidderId = userId;
  }

  if (search) {
    query["$or"] = [
      { JobTitle: { $regex: search, $options: "i" } },
      { nameofbidder: { $regex: search, $options: "i" } },
      { jobLink: { $regex: search, $options: "i" } },
      { IdUsed: { $regex: search, $options: "i" } },
    ];
  }

  return query;
};

const getBids = async (query, skip) => {
  try {
    const aggregationPipeline = [
      { $match: query },
      {
        $sort: { createdAt: -1 },
      },
      ...(skip !== null ? [{ $skip: skip }, { $limit: 10 }] : []),
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: userIdModel.collection.name,
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
          from: userIdModel.collection.name,
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
  try {
    const id = req.params.id;
    Bidding.findByIdAndUpdate(
      id,
      {
        JobTitle: req.body.JobTitle,
        idUsedForBid: req.body.IdUsed,
        portal: req.body.portal,
        URL: req.body.URL,
        department: req.body.department,
        status: req.body.status,
        connect: req.body.connect,
        jobLink: req.body.jobLink,
        technology: req.body.technology,
        bidType: req.body.bidType,
      },
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
            from: userIdModel.collection.name,
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
            from: userIdModel.collection.name,
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

exports.usercountBids = async function (req, res) {
  const date = new Date();
  const todayDateBid = date.setHours(0, 0, 0, 0);
  let WeekStartDate = moment().subtract(1, "weeks").startOf("week");
  let WeekEndDate = moment().subtract(1, "weeks").endOf("week");
  let currentMonthStartDate = moment().startOf("month");
  let currentMonthLastDate = moment().endOf("month");

  let lastMonthStartDate = moment()
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  let lastMonthEndDate = moment()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");

  let username = req.user.username;
  let isAdmin = req.user.isAdmin;
  try {
    if (isAdmin) {
      let BidToday = await Bidding.countDocuments({
        createdAt: { $gte: todayDateBid },
      });
      let BidWeek = await Bidding.countDocuments({
        createdAt: { $gte: WeekStartDate, $lte: WeekEndDate },
      });
      let BidLastMonth = await Bidding.countDocuments({
        createdAt: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
      });
      let BidCurrentMonth = await Bidding.countDocuments({
        createdAt: { $gte: currentMonthStartDate, $lte: currentMonthLastDate },
      });
      let totalBid = await Bidding.estimatedDocumentCount({});
      res.status(200).json({
        totalCountBid: totalBid,
        countToday: BidToday,
        countWeek: BidWeek,
        lastMonthBidCount: BidLastMonth,
        currentMonthBidCount: BidCurrentMonth,
        dateStartLastMonth: lastMonthStartDate,
        dateEndLastMonth: lastMonthEndDate,
      });
    } else {
      let totalBid = await Bidding.find({
        username: username,
      }).countDocuments();
      let BidToday = await Bidding.find({ username: username }).countDocuments({
        createdAt: { $gte: todayDateBid },
      });
      let BidWeek = await Bidding.find({ username: username }).countDocuments({
        createdAt: { $gte: WeekStartDate, $lte: WeekEndDate },
      });
      let BidLastMonth = await Bidding.find({
        username: username,
      }).countDocuments({
        createdAt: { $gte: lastMonthStartDate, $lte: lastMonthEndDate },
      });
      let BidCurrentMonth = await Bidding.find({
        username: username,
      }).countDocuments({
        createdAt: { $gte: currentMonthStartDate, $lte: currentMonthLastDate },
      });

      res.status(200).json({
        totalCountBid: totalBid,
        countToday: BidToday,
        countWeek: BidWeek,
        lastMonthBidCount: BidLastMonth,
        currentMonthBidCount: BidCurrentMonth,
        dateStartLastMonth: lastMonthStartDate,
        dateEndLastMonth: lastMonthEndDate,
      });
    }
  } catch (ex) {
    logger.error(ex.message);
    res.status(500).send({ message: "Internal server error." });
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

    let { status, startDate, endDate, month } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      endDate.setHours(endDate.getHours() + 23);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (status && startDate && endDate) {
      (query.createdAt = { $gte: startDate, $lte: endDate }),
        (query.status = status);
    }

    const Bid = await Bidding.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$username",
          totalBidNo: { $sum: 1 },
        },
      },
      {
        $project: {
          nameofbidder: "$_id",
          totalBidNo: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json({ Bid });
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
            from: userIdModel.collection.name,
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
            from: userIdModel.collection.name,
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

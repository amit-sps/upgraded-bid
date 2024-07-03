const {
  param,
  query,
  body,
  validationResult,
  check,
} = require("express-validator");
const bidding = require("../models/bid");
const userId = require("../models/team");
const authModel = require("../models/auth");
const { PORTALS, BID_STATUS } = require("../utils/constant");

exports.bidsValidate = [
  body("title").trim().notEmpty().withMessage("JobTitle is required."),

  body("team")
    .isMongoId()
    .withMessage("Invalid Team ID.")
    .custom(async (value) => {
      const teamExists = await authModel.findById(value);
      if (!teamExists) {
        return Promise.reject("Team does not exist.");
      }
    }),

  body("bidLink")
    .trim()
    .notEmpty()
    .withMessage("Bid link is required.")
    .isURL()
    .withMessage("Bid URL is invalid.")
    .custom(async (value, { req }) => {
      const bid = await bidding.findOne({
        bidLink: value,
        _id: { $ne: req.params.id },
      });
      if (bid) {
        return Promise.reject("Bid link already exists.");
      }
    }),

  body("portal").isIn(PORTALS).withMessage("Portal is Invalid."),

  body("bidStatus")
    .isIn(Object.keys(BID_STATUS).map((key) => BID_STATUS[key]))
    .withMessage("Status is invalid"),

  body("proposalLink")
    .trim()
    .notEmpty()
    .withMessage("Proposal link is required.")
    .custom(async (value, { req }) => {
      const bid = await bidding.findOne({
        proposalLink: value,
        _id: { $ne: req.params.id },
      });
      if (bid) {
        return Promise.reject("Proposal link already exists.");
      }
    }),

  body("connect").trim().notEmpty().withMessage("Connect is required."),

  body("technology").notEmpty().withMessage("Technology is required."),
];

exports.getBidsValidate = [
  query("pageCount").optional().isNumeric().withMessage("Invalid page number."),
  query("status")
    .optional()
    .isIn(Object.keys(BID_STATUS).map((key) => BID_STATUS[key])),
  query("bidType").optional().isIn(["Bid", "Invite", "Email Marketing"]),
];

exports.getBidsWithoutPaginationValidate = [
  query("status")
    .optional()
    .isIn(Object.keys(BID_STATUS).map((key) => BID_STATUS[key])),
  query("bidType").optional().isIn(["Bid", "Invite", "Email Marketing"]),
];

exports.getBidByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
];

exports.searchByValueValidate = [
  query("value").not().isEmpty().withMessage("Value cannot be empty."),
  query("pageCount").not().isEmpty().withMessage("PageCount cannot be empty."),
];

exports.userBidsValidate = [
  query("status")
    .optional()
    .isIn(Object.keys(BID_STATUS).map((key) => BID_STATUS[key])),
  check("startDate")
    .optional()
    .custom((value, { req }) => {
      if (!(req.query.startDate && req.query.endDate)) {
        throw new Error("With startDate endDate is required.");
      }
      return true;
    }),
];

const {
  param,
  query,
  body,
  validationResult,
  check,
} = require("express-validator");
const bidding = require("../models/bid");
const userId = require("../models/userId");

exports.addBidsValidate = [
  body("JobTitle")
    .trim()
    .notEmpty()
    .bail()
    .withMessage("JobTitle is required."),
  body("IdUsed")
    .isMongoId()
    .exists()
    .withMessage("Id is Invalid.")
    .custom(async (value) => {
      return userId.findById(value).then((userId) => {
        if (!userId) {
          return Promise.reject("Idused does not exist.");
        }
        return true;
      });
    }),
  body("URL", "URL is required.")
    .trim()
    .notEmpty()
    .bail()
    .custom((value) => {
      return bidding.findOne({ URL: value }).then((URL) => {
        if (URL !== null) {
          return Promise.reject("URL Already exist.");
        }
        return true;
      });
    })
    .isURL()
    .withMessage("URL is invalid."),
  body("department")
    .isIn([
      "OST",
      "BED",
      "JST",
      "LAMP",
      "MED",
      "SDM",
      "MSS",
      "SI",
      "DTX",
      "DevOps",
    ])
    .withMessage("Department is invalid."),
  body("portal")
    .isIn([
      "Upwork",
      "PPH",
      "GURU",
      "LinkedIn",
      "Email Marketing",
      "Appfutura",
      "Freelancer",
      "Codeur",
    ])
    .withMessage("Portal is Invalid."),
  body("bidType")
    .isIn(["Bid", "Invite", "Email Marketing"])
    .withMessage("BidType is invalid."),
  body("status")
    .isIn(["Job Submitted", "Response Received", "Scrapped", "Converted"])
    .withMessage("Status is invalid"),
  body("jobLink", "JobLink is required.")
    .trim()
    .notEmpty()
    .bail()
    .custom((value) => {
      return bidding.findOne({ jobLink: value }).then((jobLink) => {
        if (jobLink !== null) {
          return Promise.reject("JobLink Already exist.");
        }
        return true;
      });
    }),
  body("connect").trim().notEmpty().bail().withMessage("Connect is required."),
  body("technology")
    .trim()
    .notEmpty()
    .bail()
    .withMessage("Technology is required."),
];

exports.getBidsValidate = [
  query("pageCount").optional().isNumeric().withMessage("Invalid page number."),
  query("status")
    .optional()
    .isIn(["Job Submitted", "Response Received", "Scrapped", "Converted"]),
  query("bidType").optional().isIn(["Bid", "Invite", "Email Marketing"]),
];

exports.getBidsWithoutPaginationValidate = [
  query("status")
    .optional()
    .isIn(["Job Submitted", "Response Received", "Scrapped", "Converted"]),
  query("bidType").optional().isIn(["Bid", "Invite", "Email Marketing"]),
];

exports.getBidByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
];

exports.editBidByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
  body("JobTitle")
    .trim()
    .notEmpty()
    .bail()
    .withMessage("JobTitle is required."),
  body("URL", "URL is required.")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (value, { req }) => {
      let Bid = await bidding
        .findOne({ URL: value, _id: { $ne: req.params.id } })
        .then((Bid) => {
          if (Bid) {
            return Promise.reject("URL already exist.");
          }
          return true;
        });
    })
    .isURL()
    .withMessage("URL is invalid."),
  body("department")
    .isIn([
      "OST",
      "BED",
      "JST",
      "LAMP",
      "MED",
      "SDM",
      "MSS",
      "SI",
      "DTX",
      "DevOps",
    ])
    .withMessage("Department is invalid."),
  body("status")
    .isIn(["Job Submitted", "Response Received", "Scrapped", "Converted"])
    .withMessage("Status is invalid."),
  body("bidType")
    .isIn(["Bid", "Invite", "Email Marketing"])
    .withMessage("BidType is invalid."),
  body("jobLink", "JobLink is required.")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (value, { req }) => {
      let Bid = await bidding
        .findOne({ jobLink: value, _id: { $ne: req.params.id } })
        .then((Bid) => {
          if (Bid) {
            return Promise.reject("JobLink Already exist.");
          }
          return true;
        });
    }),
  body("IdUsed")
    .isMongoId()
    .exists()
    .withMessage("Id is invalid.")
    .trim()
    .notEmpty()
    .bail()
    .withMessage("IdUsed is required."),
  body("portal")
    .isIn([
      "Upwork",
      "PPH",
      "GURU",
      "LinkedIn",
      "Email Marketing",
      "Appfutura",
      "Freelancer",
      "Codeur",
    ])
    .withMessage("Portal is invalid."),
  body("connect").trim().notEmpty().bail().withMessage("Connect is required."),
  body("technology")
    .trim()
    .notEmpty()
    .bail()
    .withMessage("Technology is required."),
];
exports.searchByValueValidate = [
  query("value").not().isEmpty().withMessage("Value cannot be empty."),
  query("pageCount").not().isEmpty().withMessage("PageCount cannot be empty."),
];

exports.userBidsValidate = [
  query("status")
    .optional()
    .isIn(["Job Submitted", "Response Received", "Scrapped", "Converted", ""]),
  check("startDate")
    .optional()
    .custom((value, { req }) => {
      if (!(req.query.startDate && req.query.endDate)) {
        throw new Error("With startDate endDate is required.");
      }
      return true;
    }),
];

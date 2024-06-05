const { param, body } = require("express-validator");
const userId = require("../models/userId");

exports.addUserIdValidate = [
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
  body("id", "Id is required.")
    .trim()
    .notEmpty()
    .bail()
    .custom((value) => {
      return userId.findOne({ id: value }).then((userid) => {
        if (userid !== null) {
          return Promise.reject("UserId already exist.");
        }
        return true;
      });
    }),
];

exports.getUserIdByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
];

exports.editUserIdByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
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
  body("id").trim().notEmpty().bail().withMessage("Id is required."),
];

exports.deleteUserIdByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
];

exports.getByPortalValidate = [
  param("portal")
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
];

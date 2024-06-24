const { param, body } = require("express-validator");
const teamModel = require("../models/team");

exports.addTeamValidate = [
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
      return teamModel.findOne({ id: value }).then((team) => {
        if (team !== null) {
          return Promise.reject("Team already exist.");
        }
        return true;
      });
    }),
];

exports.getTeamByIdValidate = [
  param("id").isMongoId().exists().withMessage("Id is invalid."),
];

exports.editTeamByIdValidate = [
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

exports.deleteTeamByIdValidate = [
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

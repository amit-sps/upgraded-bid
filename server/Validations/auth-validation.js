const { body, validationResult } = require("express-validator");
const User = require("../models/auth");

exports.validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required and cannot be empty."),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already in use.");
      }
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid.")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already in use.");
      }
    }),
];

exports.validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

exports.validateForgotPassword = [
  body("email", "Email is required.")
    .trim()
    .notEmpty()
    .bail()
];

exports.validateResetPassword = [
  body("password")
    .notEmpty()
    .isLength({
      min: 6,
    })
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "Password must be greater than 6 and contain at least one uppercase letter, one lowercase letter,one number and special characters also required"
    ),
];

exports.updateEmailValidation = [
  body("email", "Email is required.")
    .trim()
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage("Email is not valid.")
    .bail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user !== null) {
          return Promise.reject("Email already in use.");
        }
        return true;
      });
    }),
];

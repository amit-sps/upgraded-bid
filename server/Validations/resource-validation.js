const { body, validationResult } = require("express-validator");
const Auth = require("../models/resource");

exports.addResourceValidate = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("link")
    .trim()
    .notEmpty()
    .withMessage("Link is required.")
    .isURL()
    .withMessage("Invalid URL format."),

  body("coverImage").optional().isURL().withMessage("Invalid URL format."),

  body("description").trim().notEmpty().withMessage("Description is required."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateResourceValidate = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('link').trim().notEmpty().withMessage('Link is required.').isURL().withMessage('Invalid URL format.'),
  body('coverImage').optional().trim().isURL().withMessage('Invalid URL format.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
];

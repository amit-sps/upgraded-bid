const UserId = require("../models/userId");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userId = require("../models/userId");

exports.addUserId = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const userId = new UserId(req.body);
  try {
    UserId.findOne({ id: userId.id, portal: userId.portal }, (err, data) => {
      if (data) {
        res.status(401).send({
          message: "UserId already exist.",
        });
      } else {
        userId.save((err, id) => {
          if (err) {
            res.status(400).send({
              message: err.message,
            });
          } else {
            res.status(201).send({ userId: userId });
          }
        });
      }
    });
  } catch (ex) {
    res.status(401).send({ message: ex.message });
  }
};

exports.getUserId = async (req, res) => {
  try {
    UserId.find({}, (err, userId) => {
      res.status(200).send({ userId: userId });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.getUserIdById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    UserId.find({ _id: req.params.id }, (err, userId) => {
      res.status(200).send({ userId: userId });
    });
  } catch (ex) {
    res.status(401).send({ message: ex.message });
  }
};

exports.editUserIdById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const id = req.params.id;
  UserId.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    },
    function (err, data) {
      if (!err) {
        res.status(201).json({
          userId: data,
        });
      } else {
        res.status(500).json({
          message: "Not found any relative data.",
        });
      }
    }
  );
};
exports.deleteUserIdById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const id = req.params.id;
  UserId.findOneAndRemove({ _id: id }, function (err, data) {
    if (!err) {
      res.status(203).json({
        userId: data,
      });
    } else {
      res.status(500).json({
        message: "Not found any relative data.",
      });
    }
  });
};

exports.getByPortal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  UserId.find({ portal: req.params.portal }, function (err, data) {
    if (!err) {
      res.status(203).json({
        userId: data,
      });
    } else {
      res.status(500).json({
        message: "Not found any relative data.",
      });
    }
  });
};

exports.searchByValue = async (req, res) => {
  const value = req.params.value;
  try {
    userId.find(
      {
        $or: [{ id: { $regex: value, $options: "i" } }],
      },
      (err, userId) => {
        res.status(200).send({ userId: userId });
      }
    );
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

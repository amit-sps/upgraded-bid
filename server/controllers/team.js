const teamModel = require("../models/team");
const { validationResult } = require("express-validator");

exports.addTeam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const team = new teamModel(req.body);
  try {
    teamModel.findOne({ id: team.id, portal: team.portal }, (err, data) => {
      if (data) {
        res.status(401).send({
          message: "UserId already exist.",
        });
      } else {
        team.save((err, id) => {
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

exports.getTeam = async (req, res) => {
  try {
    teamModel.find({}, (err, teams) => {
      res.status(200).send({ data: teams });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.getTeamById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    teamModel.find({ _id: req.params.id }, (err, team) => {
      res.status(200).send({ data: team });
    });
  } catch (ex) {
    res.status(401).send({ message: ex.message });
  }
};

exports.editTeamById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const id = req.params.id;
  teamModel.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
    },
    function (err, data) {
      if (!err) {
        res.status(201).json({
          data,
        });
      } else {
        res.status(500).json({
          message: "Not found any relative data.",
        });
      }
    }
  );
};
exports.deleteTeamById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const id = req.params.id;
  teamModel.findOneAndRemove({ _id: id }, function (err, data) {
    if (!err) {
      res.status(203).json({
        data,
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
  teamModel.find({ portal: req.params.portal }, function (err, data) {
    if (!err) {
      res.status(203).json({
        data,
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
    teamModel.find(
      {
        $or: [{ id: { $regex: value, $options: "i" } }],
      },
      (err, teams) => {
        res.status(200).send({ data: teams });
      }
    );
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

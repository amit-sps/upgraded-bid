const authModel = require("../models/auth");
require("dotenv").config();
const Token = require("../models/token");
const sendEmail = require("../Email/emailConfig");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { PRIVATE_KEY } = require("../config/jwt.config");
const { APP_FRONTENED_URL } = require("../config/app.config");
const logger = require("../utils/winston.util");
const ejs = require("ejs");
const path = require("path");
const sendMail = require("../utils/mailer");

exports.register = async (req, res) => {
  try {
    const { token } = req.params;
    const isValidToken = jwt.verify(token, process.env.INVITE_SECRET);

    if (!isValidToken) {
      return res.status(400).json({
        message: "Invalid invite token or expired.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let encPwd = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

    const authData = await authModel.create({
      name: req.body.name,
      password: encPwd,
      username: req.body.username,
      email: req.body.email,
      isEmailVerified: true

    });

    if (authData._id) {
      return res.status(201).send({ message: "Invite accepted." });
    } else {
      return res.status(400).send({
        message: "Something went wrong please try again.",
      });
    }
  } catch (ex) {
    logger.error(ex.message);
    return res.status(500).send({ message: "Internal server error." });
  }
};

exports.sendInvite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const inviteToken = jwt.sign(
      { email: req.body.email },
      process.env.INVITE_SECRET,
      { expiresIn: "1d" }
    );

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    const mailTemplate = await ejs.renderFile(
      path.join(__dirname, "../utils/template", "invite-template.ejs"),
      { inviteLink, supportMail: process.env.MAIL_FROM_ADDRESS }
    );

    sendMail({
      to: req.body.email,
      subject: "Invite for join team",
      html: mailTemplate,
    });

    return res.status(201).json({ message: "Invite sent to the email." });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.validateInviteToken = async (req, res) => {
  try {
    const { token } = req.params;
    const isValidToken = jwt.verify(token, process.env.INVITE_SECRET);

    console.log(isValidToken);

    if (!isValidToken) {
      return res.status(400).json({
        message: "Invalid invite token or expired.",
      });
    }
    return res.status(200).json({
      message: "Valid invite token.",
      data: { email: isValidToken.email },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid invite token or expired.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let userData = req.body;

    authModel.findOne(
      { $or: [{ username: userData.username }, { email: userData.username }] },
      async (error, user) => {
        if (user?.deleted) {
          return res.status(403).send({ message: "User doesn't exists." });
        } else if (user === null) {
          return res.status(403).send({ message: "Invalid credentials." });
        } else {
          const valid_pass = await bcrypt.compare(
            userData.password,
            user.password
          );
          if (!valid_pass) {
            return res.status(403).send({ message: "Invalid credentials." });
          } else {
            let token = jwt.sign({ id: user._id }, PRIVATE_KEY);
            res.status(200).send({
              token,
              user: {
                role: user.role,
                name: user.name,
                username: user.username,
                _id: user._id,
                emailExist: user.email === undefined ? false : true,
                skills: user.skills || [],
              },
            });
          }
        }
      }
    );
  } catch (ex) {
    logger.error(ex.message);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

exports.getProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const user = await authModel.findOne({
      $or: [{ email: req.body.email }, { username: req.body.email }],
    });
    if (!user) {
      return res.status(403).json({
        message: "User with given email doesn't exist.",
      });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const link = `${APP_FRONTENED_URL}/reset_password?token=${token.token}`;
    await sendEmail(user.email, "Password reset", link);
    res.status(201).json({
      message: "A password reset link has been sent to your email.",
    });
  } catch (ex) {
    logger.error(ex.message);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const userToken = await Token.findOne({ token: req.params.token });
    if (!userToken) {
      return res.status(403).json({ message: "Invalid link or expired." });
    }
    const user = await authModel.findOne({
      _id: userToken.userId,
    });
    if (!user) {
      return res.status(403).json({ message: "Invalid link or expired." });
    }
    let encPwd = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    user.password = encPwd;
    await user.save();
    await userToken.delete();
    res.status(201).json({
      message: "Password reset successfully.",
    });
  } catch (ex) {
    logger.error(ex.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  try {
    const { email } = req.body;
    const { _id: userId } = req.user;
    await authModel.findByIdAndUpdate(userId, { email });
    return res.status(200).json({ status: true, message: "Email updated." });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

exports.updateSkills = async (_req, _res) => {
  try {
    const { skills } = _req.body;
    console.log("Skills", skills)
    const { _id: userId } = _req.user;
    await authModel.findByIdAndUpdate(userId, { skills });
    return _res.status(200).json({ status: true, message: "Skills updated." });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

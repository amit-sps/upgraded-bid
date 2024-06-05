const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config/jwt.config");
const authModel = require("../models/auth");

function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, PRIVATE_KEY, async function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.user = await authModel.findById(decoded.id);
    next();
  });
}

function isAdmin(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, PRIVATE_KEY, async function (err, decoded) {
    if (err)
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.user = await authModel.findById(decoded.id);
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Authentication failed." });
    }
  });
}

module.exports = { verifyToken, isAdmin };

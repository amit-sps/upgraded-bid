const Roles = require("../utils/roles");

const roleGuard =
  (roles = []) =>
  (req, res, next) => {
    const user = req?.user;
    console.log(roles, user.role, roles.includes(user.role));
    if (!user) {
      return res.status(404).send({ auth: false, message: "User not found." });
    }

    if (roles.includes(user.role) || roles.includes(Roles.ForAll)) {
      return next();
    }

    return res.status(403).json({ status: false, message: "Not authorized." });
  };

module.exports = roleGuard;

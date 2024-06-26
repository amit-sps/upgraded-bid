const express = require("express");
const roleGuard = require("../middlewares/roleguard");
const Roles = require("../utils/roles");
const {
  getAllUsers,
  updateSkills,
  toggleStatus,
} = require("../controllers/users");
const router = express.Router();

router.get("/", roleGuard([Roles.Admin, Roles.AmitOnly]), getAllUsers);
router.put("/skills/:userId", roleGuard([Roles.ForAll]), updateSkills);
router.put(
  "/toggle/status/:userId",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  toggleStatus
);

module.exports = router;

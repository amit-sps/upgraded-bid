const express = require("express");
const router = express.Router();
const {
  addTeamValidate,
  getTeamByIdValidate,
  editTeamByIdValidate,
  deleteTeamByIdValidate,
  getByPortalValidate,
} = require("../Validations/team-validation");
const {
  addTeam,
  getTeam,
  getTeamById,
  editTeamById,
  deleteTeamById,
  getByPortal,
  searchByValue,
} = require("../controllers/team");
const roleGuard = require("../middlewares/roleguard");
const Roles = require("../utils/roles");

router.post(
  "/addTeam",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  addTeamValidate,
  addTeam
);
router.get("/getTeam", roleGuard([Roles.Admin, Roles.AmitOnly]), getTeam);
router.get(
  "/getTeamById/:id",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  getTeamByIdValidate,
  getTeamById
);
router.put(
  "/editTeamById/:id",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  editTeamByIdValidate,
  editTeamById
);
router.delete(
  "/deleteTeam/:id",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  deleteTeamByIdValidate,
  deleteTeamById
);
router.get(
  "/getByPortal/:portal",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  getByPortalValidate,
  getByPortal
);
router.get(
  "/searchByValue/:value",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  searchByValue
);

module.exports = router;

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

router.post("/addTeam", addTeamValidate, addTeam);
router.get("/getTeam", getTeam);
router.get("/getTeamById/:id", getTeamByIdValidate, getTeamById);
router.put("/editTeamById/:id", editTeamByIdValidate, editTeamById);
router.delete("/deleteTeam/:id", deleteTeamByIdValidate, deleteTeamById);
router.get("/getByPortal/:portal", getByPortalValidate, getByPortal);
router.get("/searchByValue/:value", searchByValue);

module.exports = router;

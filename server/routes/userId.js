const express = require("express");
const router = express.Router();
const {
  addUserIdValidate,
  getUserIdByIdValidate,
  editUserIdByIdValidate,
  deleteUserIdByIdValidate,
  getByPortalValidate,
} = require("../Validations/userId-validation");
const {
  addUserId,
  getUserId,
  getUserIdById,
  editUserIdById,
  deleteUserIdById,
  getByPortal,
  searchByValue,
} = require("../controllers/userId");

router.post("/addUserId", addUserIdValidate, addUserId);
router.get("/getUserId", getUserId);
router.get("/getUserIdById/:id", getUserIdByIdValidate, getUserIdById);
router.put("/editUserIdById/:id", editUserIdByIdValidate, editUserIdById);
router.delete("/deleteUserId/:id", deleteUserIdByIdValidate, deleteUserIdById);
router.get("/getByPortal/:portal", getByPortalValidate, getByPortal);
router.get("/searchByValue/:value", searchByValue);

module.exports = router;

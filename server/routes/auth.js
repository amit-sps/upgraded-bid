const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authmiddleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  updateEmailValidation,
  validateSendInvite,
} = require("../Validations/auth-validation");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateEmail,
  getProfile,
  sendInvite,
  validateInviteToken,
  updateSkills,
} = require("../controllers/auth");

router.post("/accept-invite/:token", validateRegister, register);
router.post("/send-invite", validateSendInvite, sendInvite);
router.get("/verify/invite-token/:token", validateInviteToken);
router.post("/login", validateLogin, login);
router.get("/profile", verifyToken, getProfile);
router.post("/forgotPassword", validateForgotPassword, forgotPassword);
router.post("/:token", validateResetPassword, resetPassword);

// update the logged user email
router.put("/update_email", updateEmailValidation, verifyToken, updateEmail);
router.put("/skills", verifyToken, updateSkills);

module.exports = router;

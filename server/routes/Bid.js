const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/authmiddleware");
const {
  addBidsValidate,
  getBidsValidate,
  getBidByIdValidate,
  editBidByIdValidate,
  searchByValueValidate,
  getBidsWithoutPaginationValidate,
  userBidsValidate,
} = require("../Validations/Bids-validation");
const {
  addBid,
  getBid,
  getBidById,
  editBidById,
  searchByValue,
  userBids,
  usercountBids,
  getAllPortalRecords,
  getBidsWithoutPagination,
  getBidTable,
} = require("../controllers/Bid");

router.post("/addBid", addBidsValidate, addBid);
router.get("/getBid", getBidsValidate, getBid);
router.get("/getBidById/:id", getBidByIdValidate, getBidById);
router.put("/editBidById/:id", editBidByIdValidate, editBidById);
router.get("/search", searchByValueValidate, searchByValue);
router.get("/countUserBids", isAdmin, userBidsValidate, userBids);
router.get("/biduser", usercountBids);
router.get("/getAllPortalRecords", getAllPortalRecords);
router.get(
  "/getBidWithoutPagination",
  getBidsWithoutPaginationValidate,
  getBidsWithoutPagination
);
router.get("/getBidTable", isAdmin, getBidTable);
module.exports = router;

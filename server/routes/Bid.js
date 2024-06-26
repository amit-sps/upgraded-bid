const express = require("express");
const router = express.Router();
const roleGuard = require("../middlewares/roleguard");
const Roles = require("../utils/roles");

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

router.post(
  "/addBid",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  addBidsValidate,
  addBid
);
router.get(
  "/getBid",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  getBidsValidate,
  getBid
);
router.get(
  "/getBidById/:id",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  getBidByIdValidate,
  getBidById
);
router.put(
  "/editBidById/:id",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  editBidByIdValidate,
  editBidById
);
router.get(
  "/search",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  searchByValueValidate,
  searchByValue
);
router.get(
  "/countUserBids",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  userBidsValidate,
  userBids
);
router.get(
  "/biduser",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  usercountBids
);
router.get(
  "/getAllPortalRecords",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  getAllPortalRecords
);
router.get(
  "/getBidWithoutPagination",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  getBidsWithoutPaginationValidate,
  getBidsWithoutPagination
);
router.get(
  "/getBidTable",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  getBidTable
);
module.exports = router;

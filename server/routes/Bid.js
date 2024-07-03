const express = require("express");
const router = express.Router();
const roleGuard = require("../middlewares/roleguard");
const Roles = require("../utils/roles");

const {
  bidsValidate,
  getBidsValidate,
  getBidByIdValidate,
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
  dashboardCount,
  getAllPortalRecords,
  getBidsWithoutPagination,
  getBidTable,
  getAllSKills,
  getBidderTeamBySkills,
} = require("../controllers/Bid");

router.post(
  "/addBid",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  bidsValidate,
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
  bidsValidate,
  editBidById
);

router.get(
  "/search",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  searchByValueValidate,
  searchByValue
);

router.get(
  "/graph",
  roleGuard([Roles.Admin, Roles.AmitOnly]),
  userBidsValidate,
  userBids
);

router.get(
  "/dashboard/count",
  roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly]),
  dashboardCount
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

router.get("/skills", roleGuard([Roles.ForAll]), getAllSKills);

router.get("/teams", roleGuard([Roles.ForAll]), getBidderTeamBySkills);

module.exports = router;

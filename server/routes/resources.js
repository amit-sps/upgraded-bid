const express = require("express");
const roleguard = require("../middlewares/roleguard");
const Roles = require("../utils/roles");
const {
  addResourceValidate,
  updateResourceValidate,
} = require("../Validations/resource-validation");
const {
  addResource,
  getAllResources,
  getMyResources,
  updateResource,
  getResourceById,
  deleteResourceById,
} = require("../controllers/resource");
const router = express.Router();

router.post(
  "/add-resource",
  addResourceValidate,
  roleguard([Roles.ForAll]),
  addResource
);
router.put(
  "/:id",
  updateResourceValidate,
  roleguard([Roles.ForAll]),
  updateResource
);

router.get("/:id", roleguard([Roles.ForAll]), getResourceById);
router.delete("/:id", roleguard([Roles.ForAll]), deleteResourceById);

router.get("/", roleguard([Roles.ForAll]), getAllResources);

router.get("/my/all", roleguard([Roles.ForAll]), getMyResources);

module.exports = router;

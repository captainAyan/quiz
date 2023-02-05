const express = require("express");

const router = express.Router();
const {
  getProfile,
  editProfile,
} = require("../../controllers/userController.js");
const { protect } = require("../../middleware/authMiddleware.js");

router.get("/:id", protect, getProfile);
router.put("/", protect, editProfile);

module.exports = router;

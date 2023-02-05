const express = require("express");

const router = express.Router();
const {
  login,
  register,
  changePassword,
} = require("../../controllers/userController.js");
const { protect } = require("../../middleware/authMiddleware.js");

router.post("/login", login);
router.post("/register", register);
router.put("/changePassword", protect, changePassword);

module.exports = router;

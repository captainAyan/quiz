const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/quiz", require("./quizRoutes"));
router.use("/profile", require("./profileRoutes"));

module.exports = router;

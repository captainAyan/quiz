const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/quiz", require("./quizRoutes"));

module.exports = router;

const express = require("express");

const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  editQuiz,
  deleteQuiz,
} = require("../../controllers/quizController.js");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createQuiz);
router.get("/", protect, getQuizzes);
router.get("/:id", protect, getQuiz);
router.put("/:id", protect, editQuiz);
router.delete("/:id", protect, deleteQuiz);

module.exports = router;
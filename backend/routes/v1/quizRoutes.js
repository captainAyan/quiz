const express = require("express");

const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  editQuiz,
  deleteQuiz,
  getQuizQuestions,
  postQuizAnswers,
} = require("../../controllers/quizController.js");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createQuiz);
router.get("/", protect, getQuizzes);
router.get("/:id", protect, getQuiz);
router.put("/:id", protect, editQuiz);
router.delete("/:id", protect, deleteQuiz);
router.get("/:id/questions", protect, getQuizQuestions);
router.post("/:id/answers", protect, postQuizAnswers);

module.exports = router;

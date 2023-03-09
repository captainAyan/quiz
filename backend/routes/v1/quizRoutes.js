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
  getQuizAnswers,
  getMarkSheets,
} = require("../../controllers/quizController.js");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", protect, createQuiz);
router.get("/", protect, getQuizzes);
router.get("/marksheet", protect, getMarkSheets);
router.get("/:id", protect, getQuiz);
router.put("/:id", protect, editQuiz);
router.delete("/:id", protect, deleteQuiz);
router.get("/:id/questions", protect, getQuizQuestions);
router.post("/:id/answers", protect, postQuizAnswers);
router.get("/:id/answers", protect, getQuizAnswers);

module.exports = router;

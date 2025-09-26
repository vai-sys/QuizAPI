const express = require("express");
const { 
  createQuiz, 
  getAllQuizzes, 
  getQuizQuestions, 
  submitAnswers 
} = require("../controllers/quizController");

const router = express.Router();


router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:quizId/questions", getQuizQuestions);
router.post("/:quizId/submit", submitAnswers);

module.exports = router;

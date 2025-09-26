const express = require("express");
const { 
  createQuiz, 
  getAllQuizzes, 
  getQuizQuestions, 
  submitAnswers 
} = require("../controllers/quizController");
const { deleteMany } = require("../models/Quiz");

const router = express.Router();


router.post("/", createQuiz);
router.get("/", getAllQuizzes);
router.get("/:quizId/questions", getQuizQuestions);
router.post("/:quizId/submit", submitAnswers);
router.delete("/:quizId",deleteMany)

module.exports = router;

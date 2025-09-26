const express = require("express");
const { 
  addQuestion, 
  getQuestion, 
  updateQuestion, 
  deleteQuestion 
} = require("../controllers/questionController");

const router = express.Router();


router.post("/quiz/:quizId/questions", addQuestion);
router.get("/:questionId", getQuestion);
router.put("/:questionId", updateQuestion);
router.delete("/:questionId", deleteQuestion);

module.exports = router;
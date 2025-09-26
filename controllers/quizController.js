



const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const createQuiz = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        error: "Title is required to create the quiz" 
      });
    }

    const quiz = new Quiz({ title: title.trim() });
    await quiz.save();

    return res.status(201).json({ 
      success: true, 
      message: "Successfully created the quiz", 
      data: quiz 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select("title _id createdAt")
      .populate({
        path: "questions",
        select: "_id"
      });
    
    const quizzesWithCount = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questionCount: quiz.questions.length
    }));

    res.json({ 
      success: true,
      count: quizzesWithCount.length,
      quizzes: quizzesWithCount 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return res.status(400).json({ 
        success: false, 
        error: "Quiz ID is required" 
      });
    }

    const quiz = await Quiz.findById(quizId).populate("questions");
    
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        error: "Quiz not found" 
      });
    }

    
    const questions = quiz.questions.map(q => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      hint: q.hint,
      marks: q.marks,
      options: q.type !== "text" ? q.options.map(o => ({
        _id: o._id,
        text: o.text
      
      })) : []
    }));

    res.json({
      success: true,
      quizId: quiz._id,
      title: quiz.title,
      totalQuestions: questions.length,
      questions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const submitAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedOptionIds: [], textAnswer: "" }]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "Answers are required" 
      });
    }

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        error: "Quiz not found" 
      });
    }

    let totalScore = 0;
    let totalMarks = 0;
    const results = [];

    for (let question of quiz.questions) {
      const answer = answers.find(a => a.questionId === question._id.toString());
      totalMarks += question.marks;
      
      let isCorrect = false;
      let userAnswer = null;

      if (!answer) {
        results.push({
          questionId: question._id,
          correct: false,
          userAnswer: null,
          correctAnswer: getCorrectAnswerForDisplay(question)
        });
        continue;
      }

      if (question.type === "text") {
        userAnswer = answer.textAnswer || "";
        // Simple text comparison (case-insensitive, trimmed)
        isCorrect = userAnswer.trim().toLowerCase() === 
                   question.correctTextAnswer.trim().toLowerCase();
      } else {
        const correctOptionIds = question.options
          .filter(o => o.isCorrect)
          .map(o => o._id.toString());

        const selectedIds = (answer.selectedOptionIds || []).map(id => id.toString());
        userAnswer = selectedIds;

        // Check if all correct options are selected and no incorrect ones
        isCorrect = correctOptionIds.length === selectedIds.length &&
                   correctOptionIds.every(id => selectedIds.includes(id));
      }

      if (isCorrect) {
        totalScore += question.marks;
      }

      results.push({
        questionId: question._id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: getCorrectAnswerForDisplay(question)
      });
    }

    res.json({ 
      success: true,
      score: totalScore, 
      totalMarks,
      percentage: totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCorrectAnswerForDisplay = (question) => {
  if (question.type === "text") {
    return question.correctTextAnswer;
  } else {
    return question.options
      .filter(o => o.isCorrect)
      .map(o => ({ _id: o._id, text: o.text }));
  }
};

module.exports = { 
  createQuiz, 
  getAllQuizzes, 
  getQuizQuestions, 
  submitAnswers 
};

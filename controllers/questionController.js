


const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, type, options, correctTextAnswer, hint, marks } = req.body;

    if (!text || !type) {
      return res.status(400).json({ 
        success: false, 
        error: "Text and type are required" 
      });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ 
        success: false, 
        error: "Quiz not found" 
      });
    }

    const questionData = {
      quiz: quizId,
      text: text.trim(),
      type,
      hint: hint || "",
      marks: marks || 1
    };

    if (type === "text") {
      questionData.correctTextAnswer = correctTextAnswer;
      questionData.options = [];
    } else {
      questionData.options = options || [];
    }

    const question = new Question(questionData);
    
 
    await question.validate();
    await question.save();

   
    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({ 
      success: true, 
      message: "Question added successfully", 
      data: question 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const question = await Question.findById(questionId).populate('quiz', 'title');
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        error: "Question not found" 
      });
    }

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return res.status(400).json({ 
        success: false, 
        error: "Request body must be a valid object with fields to update" 
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        error: "Question not found" 
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        question[key] = updates[key];
      }
    });

    await question.validate();
    await question.save();

    res.json({ 
      success: true, 
      message: "Question updated successfully", 
      data: question 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        error: "Question not found" 
      });
    }

   
    await Quiz.findByIdAndUpdate(question.quiz, {
      $pull: { questions: questionId }
    });

    await Question.findByIdAndDelete(questionId);

    res.json({ 
      success: true, 
      message: "Question deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { 
  addQuestion, 
  getQuestion, 
  updateQuestion, 
  deleteQuestion 
};
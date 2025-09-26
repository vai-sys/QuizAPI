const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
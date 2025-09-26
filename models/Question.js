const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 300
  },
  type: {
    type: String,
    enum: ["single", "multiple", "text"],
    default: "single",
    required: true
  },
  options: [{
    text: { 
      type: String,
      required: function() {
        return this.parent().type !== "text";
      }
    },
    isCorrect: { 
      type: Boolean, 
      default: false 
    }
  }],
  correctTextAnswer: {
    type: String,
    required: function() {
      return this.type === "text";
    }
  },
  hint: {
    type: String,
    maxlength: 200,
    default: ""
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


QuestionSchema.pre("validate", function (next) {
  // Text-based questions validation
  if (this.type === "text") {
    if (this.options && this.options.length > 0) {
      return next(new Error("Text-based questions should not have options"));
    }
    if (!this.correctTextAnswer) {
      return next(new Error("Text-based questions must have a correct answer"));
    }
    if (this.correctTextAnswer.length > 300) {
      return next(new Error("Text answer cannot exceed 300 characters"));
    }
  }

  // Single/Multiple choice questions validation
  if (this.type !== "text") {
    if (!this.options || this.options.length === 0) {
      return next(new Error("Single/Multiple choice questions must have options"));
    }
    

    for (let option of this.options) {
      if (!option.text || option.text.trim() === "") {
        return next(new Error("All options must have text"));
      }
    }
  }

  // Single choice validation
  if (this.type === "single") {
    const correctOptions = this.options.filter(o => o.isCorrect);
    if (correctOptions.length !== 1) {
      return next(new Error("Single choice questions must have exactly 1 correct option"));
    }
  }

  // Multiple choice validation
  if (this.type === "multiple") {
    const correctOptions = this.options.filter(o => o.isCorrect);
    if (correctOptions.length < 1) {
      return next(new Error("Multiple choice questions must have at least 1 correct option"));
    }
  }

  next();
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
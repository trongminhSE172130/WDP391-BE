const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  category: {
    type: String,
    enum: [
      "contraception",
      "STI",
      "pregnancy",
      "menstrual health",
      "sexual health",
      "other",
    ],
    required: [true, "Please select a category"],
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["open", "answered", "closed"],
    default: "open",
  },
  answers: [
    {
      consultant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultant",
        required: true,
      },
      content: {
        type: String,
        required: [true, "Please add an answer"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isSelected: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);

const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    roleTitle: {
      type: String,
      default: "",
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

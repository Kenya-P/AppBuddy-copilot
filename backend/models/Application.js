const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobDescription: { type: String, required: true },
  coverLetter: { type: String, required: true },
  answers: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  matchedKeywords: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = mongoose.model("Application", applicationSchema);

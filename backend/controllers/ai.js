const Profile = require("../models/profile");

const generateApplication = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(400).send({ message: "Profile required" });
    }

    // Temporary mock response
    const response = {
      coverLetter: `Dear Hiring Manager,

I am excited to apply for this role. With my experience in ${profile.skills.join(
        ", "
      )}, I believe I would be a strong fit.

${profile.summary}

Sincerely,
${profile.fullName}`,
      answers: [
        {
          question: "Why are you interested in this role?",
          answer: "I am excited about this opportunity because it aligns with my skills and interests.",
        },
        {
          question: "Why are you a good fit?",
          answer: `My experience in ${profile.skills.join(
            ", "
          )} makes me a strong candidate.`,
        },
      ],
    };

    return res.send(response);
  } catch (err) {
    return next(err);
  }
};

module.exports = { generateApplication };
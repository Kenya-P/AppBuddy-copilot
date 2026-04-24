const Profile = require("../models/Profile");

const generateApplication = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).send({ message: "Job description is required" });
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const summary =
      profile.summary ||
      "I bring a strong willingness to learn, collaborate, and contribute effectively.";
    const fullName = profile.fullName || "Applicant";

    const extractKeywords = (text = "") => {
      const words = text.toLowerCase().split(/\W+/);
      return [...new Set(words)].slice(0,5);
    };

    const coverLetter = `Dear Hiring Manager,

I am excited to apply for this opportunity. My background in ${
      skills.length ? skills.join(", ") : "software development"
    } makes this role especially appealing to me.

${summary}

Thank you for your time and consideration.

Sincerely,
${fullName}`;

    const answers = [
      {
        question: "Why are you interested in this role?",
        answer:
          "I am interested in this role because it aligns with my skills and gives me the opportunity to continue growing professionally.",
      },
      {
        question: "Why are you a good fit?",
        answer: `I believe I am a strong fit because of my experience with ${
          skills.length ? skills.join(", ") : "relevant technical skills"
        } and my ability to adapt and contribute thoughtfully.`,
      },
      {
        question: "What strength would you bring to the team?",
        answer:
          "I would bring adaptability, strong communication, and a willingness to learn while delivering dependable work.",
      },
    ];

    return res.send({
      coverLetter,
      answers,
    });
  } catch (err) {
    console.error("generateApplication error:", err);
    return next(err);
  }
};

module.exports = { generateApplication };
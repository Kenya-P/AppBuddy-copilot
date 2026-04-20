const Profile = require("../models/profile");

const extractKeywords = (jobDescription = "") => {
  const commonSkills = [
    "react",
    "javascript",
    "typescript",
    "node",
    "express",
    "mongodb",
    "sql",
    "python",
    "api",
    "frontend",
    "backend",
    "full-stack",
    "aws",
    "git",
  ];

  const lowerText = jobDescription.toLowerCase();

  return commonSkills.filter((skill) => lowerText.includes(skill)).slice(0, 5);
};

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

    const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
    const matchedKeywords = extractKeywords(jobDescription);

    const strongestSkills =
      matchedKeywords.length > 0
        ? matchedKeywords
        : profileSkills.slice(0, 4);

    const coverLetter = `Dear Hiring Manager,

I am excited to apply for this opportunity. My background in ${strongestSkills.join(
      ", "
    )} and my interest in building thoughtful, reliable solutions make this role especially appealing to me.

${profile.summary || "I bring a strong willingness to learn, adapt, and contribute to collaborative teams."}

I believe my experience and skills would allow me to contribute meaningfully while continuing to grow in a role that aligns with my professional goals.

Thank you for your time and consideration.

Sincerely,
${profile.fullName || "Applicant"}`;

    const answers = [
      {
        question: "Why are you interested in this role?",
        answer: `I am interested in this role because it aligns with my background in ${
          strongestSkills.join(", ") || "software development"
        } and gives me the opportunity to contribute to meaningful work while continuing to grow professionally.`,
      },
      {
        question: "Why are you a good fit?",
        answer: `I am a strong fit because I have experience with ${
          profileSkills.join(", ") || "relevant technical skills"
        } and can bring a thoughtful, motivated approach to the team.`,
      },
      {
        question: "Describe a strength you would bring to the team.",
        answer: `One of my strengths is combining technical skills with adaptability. I can learn quickly, communicate clearly, and stay focused on delivering dependable work.`,
      },
    ];

    return res.send({
      coverLetter,
      answers,
      matchedKeywords,
      profileSnapshot: {
        fullName: profile.fullName,
        summary: profile.summary,
        skills: profileSkills,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { generateApplication };
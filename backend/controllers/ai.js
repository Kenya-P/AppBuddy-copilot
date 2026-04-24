const OpenAI = require("openai");
const Profile = require("../models/Profile.js");

if (!process.env.OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY in backend/.env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateApplication = async (req, res, next) => {
  try {
    const { jobDescription } = req.body || {};

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).send({ message: "Job description is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).send({
        message: "OpenAI API key is missing. Add OPENAI_API_KEY to backend/.env and restart the server.",
      });
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const userProfile = {
      fullName: profile.fullName || "Not provided",
      email: profile.email || "Not provided",
      location: profile.location || "Not provided",
      linkedin: profile.linkedin || "Not provided",
      github: profile.github || "Not provided",
      portfolio: profile.portfolio || "Not provided",
      summary: profile.summary || "Not provided",
      skills: Array.isArray(profile.skills) ? profile.skills : [],
    };

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a professional career application assistant. Create accurate, tailored, non-fabricated application materials. Only use facts provided in the user profile. Do not invent experience, employers, degrees, certifications, or skills.",
      input: `
USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Create a concise tailored cover letter and three common application answers.
Return JSON only.
`,
      text: {
        format: {
          type: "json_schema",
          name: "application_materials",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              coverLetter: { type: "string" },
              answers: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                  },
                  required: ["question", "answer"],
                },
              },
              matchedKeywords: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["coverLetter", "answers", "matchedKeywords"],
          },
          strict: true,
        },
      },
    });

const prompt = `
You are an expert career assistant helping a junior software engineer create tailored job application materials.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
- Use ONLY the user's real experience and skills
- Do NOT invent companies, roles, or achievements
- Make the writing sound confident, human, and specific
- Tailor language to match the job description tone
- Keep the cover letter concise (under 200 words)

OUTPUT:
Return JSON with:
- coverLetter
- answers (3 questions)
- matchedKeywords (5 relevant terms from job description)
`;


    const parsed = JSON.parse(response.output_text);

    return res.send(parsed);
  } catch (err) {
    console.error("generateApplication error:", err);

    if (err.code === "invalid_api_key") {
      return res.status(401).send({
        message: "Invalid OpenAI API key. Check backend/.env and restart the server.",
      });
    }

    if (err.status === 429) {
      return res.status(429).send({
        message: "OpenAI rate limit or quota issue. Check your API billing/usage.",
        deatils: err.error?.message || err.message,
      });
    }

    return next(err);
  }
};

module.exports = { generateApplication };
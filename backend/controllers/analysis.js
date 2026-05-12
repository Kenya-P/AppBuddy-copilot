const OpenAI = require("openai");
const Profile = require("../models/Profile");

const analyzeJob = async (req, res, next) => {
  try {
    const { jobDescription } = req.body || {};

    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a career assistant. Identify skill gaps between user profile and job description.",
      input: `
PROFILE:
${JSON.stringify(profile, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return JSON only.
`,
      text: {
        format: {
          type: "json_schema",
          name: "gap_analysis",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              matchedSkills: {
                type: "array",
                items: { type: "string" },
              },
              missingSkills: {
                type: "array",
                items: { type: "string" },
              },
              suggestions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["matchedSkills", "missingSkills", "suggestions"],
          },
          strict: true,
        },
      },
    });

    res.send(JSON.parse(response.output_text));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  analyzeJob,
};
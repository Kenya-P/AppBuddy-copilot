const OpenAI = require("openai");
const Profile = require("../models/Profile");

const generateApplication = async (req, res, next) => {
  try {
    const { company, roleTitle, jobDescription } = req.body || {};

    if (!company?.trim()) {
      return res.status(400).send({ message: "Company name is required" });
    }

    if (!roleTitle?.trim()) {
      return res.status(400).send({ message: "Role title is required" });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).send({ message: "Job description is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).send({
        message:
          "OpenAI API key is missing. Add OPENAI_API_KEY to backend/.env and restart the server.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    const prompt = `
You are an expert career assistant helping a junior software engineer create tailored job application materials.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

COMPANY:
${company}

ROLE:
${roleTitle}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
- Use ONLY the user's real profile information.
- Do NOT invent employers, degrees, certifications, dates, work history, achievements, or skills.
- Tailor the writing to the company, role, and job description.
- Mirror important keywords from the job description naturally.
- Make the writing sound confident, human, specific, and professional.
- Keep the cover letter concise and under 200 words.
- Create exactly 3 application answers.
- Return 5 to 8 matched keywords from the job description.

OUTPUT:
Return valid JSON only.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are a professional career application assistant. You create accurate, tailored, non-fabricated application materials using only the user profile and job description provided.",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "application_materials",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              coverLetter: {
                type: "string",
              },
              answers: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    question: {
                      type: "string",
                    },
                    answer: {
                      type: "string",
                    },
                  },
                  required: ["question", "answer"],
                },
              },
              matchedKeywords: {
                type: "array",
                minItems: 5,
                maxItems: 8,
                items: {
                  type: "string",
                },
              },
            },
            required: ["coverLetter", "answers", "matchedKeywords"],
          },
          strict: true,
        },
      },
    });

    const parsed = JSON.parse(response.output_text);

    return res.send(parsed);
  } catch (err) {
    console.error("generateApplication error:", err);

    if (err.code === "invalid_api_key") {
      return res.status(401).send({
        message:
          "Invalid OpenAI API key. Check backend/.env and restart the server.",
      });
    }

    if (err.status === 429) {
      return res.status(429).send({
        message:
          "OpenAI rate limit or quota issue. Check your API billing/usage.",
        details: err.error?.message || err.message,
      });
    }

    return next(err);
  }
};

module.exports = { generateApplication };
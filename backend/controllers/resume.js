const { PDFParse } = require("pdf-parse");
const OpenAI = require("openai");


const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Resume file is required" });
    }

const parser = new PDFParse({ data: req.file.buffer });
const result = await parser.getText();

    return res.send({
      userId: req.user._id,
      fileName: req.file.originalname,
      text: result.text,
      uploadedAt: new Date(),
    });
  } catch (err) {
    console.error("Error parsing resume:", err);
    return next(err);
  }
};

const structureResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body || {};

    if (!resumeText?.trim()) {
      return res.status(400).send({ message: "Resume text is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).send({
        message: "OpenAI API key is missing.",
      });
    } 
    

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You extract structured professional profile data from resume text. Do not invent missing information.",
      input: `
        RESUME TEXT:
        ${resumeText}

        Extract profile information for a job application assistant.
        Return JSON only.
        `,
      text: {
        format: {
          type: "json_schema",
          name: "resume_profile",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              fullName: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              location: { type: "string" },
              linkedin: { type: "string" },
              github: { type: "string" },
              portfolio: { type: "string" },
              summary: { type: "string" },
              skills: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "fullName",
              "email",
              "phone",
              "location",
              "linkedin",
              "github",
              "portfolio",
              "summary",
              "skills"
            ],
          },
          strict: true,
        },
      },
    });

    return res.send(JSON.parse(response.output_text));
  } catch (err) {
    console.error("structureResume error:", err);

    if (err.code === "invalid_api_key") {
      return res.status(401).send({
        message: "Invalid OpenAI API key. Check backend/.env and restart the server.",
      });
    }

    if (err.status === 429) {
      return res.status(429).send({
        message: "OpenAI rate limit or quota issue. Check your API billing/usage.",
        details: err.error?.message || err.message,
      });
    }
    
    return next(err);
  }
};

module.exports = {
  parseResume,
  structureResume,
};

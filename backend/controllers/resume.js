const { PDFParse } = require("pdf-parse");

const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Resume file is required" });
    }

const parser = new PDFParse({ data: req.file.buffer });
const result = await parser.getText();

    return res.send({
      fileName: req.file.originalname,
      text: result.text,
    });
  } catch (err) {
    console.error("Error parsing resume:", err);
    return next(err);
  }
};

module.exports = { parseResume };
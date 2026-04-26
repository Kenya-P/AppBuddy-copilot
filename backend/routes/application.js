const applications = require("express").Router();
const auth = require("../middlewares/auth");
const { generateApplication } = require("../controllers/ai");

applications.post("/generate", auth, generateApplication);
applications.post("/applications", auth, generateApplication);

applications.get("/applications", auth, (req, res) => {
  res.status(200).send({ message: "Application generation endpoint is working" });
});

applications.get("/applications/:id", auth, (req, res) => {
  res.status(200).send({ message: `Fetch application with ID ${req.params.id} - endpoint is working` });
});

applications.patch("/applications/:id", auth, (req, res) => {
  res.status(200).send({ message: `Update application with ID ${req.params.id} - endpoint is working` });
});

applications.delete("/applications/:id", auth, (req, res) => {
  res.status(200).send({ message: `Delete application with ID ${req.params.id} - endpoint is working` });
});

module.exports = applications;
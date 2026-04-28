const Application = require("../models/Application");

const createApplication = async (req, res, next) => {
  try {
    const {
      company,
      roleTitle,
      jobDescription,
      coverLetter,
      answers,
      matchedKeywords,
    } = req.body;

    const application = await Application.create({
      userId: req.user._id,
      company,
      roleTitle,
      jobDescription,
      coverLetter,
      answers,
      matchedKeywords,
    });

    return res.status(201).send(application);
  } catch (err) {
    return next(err);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.send(applications);
  } catch (err) {
    return next(err);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    return res.send(application);
  } catch (err) {
    return next(err);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    return res.send(application);
  } catch (err) {
    return next(err);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    return res.send({ message: "Application deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
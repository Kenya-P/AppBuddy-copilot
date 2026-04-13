const Profile = require("../models/Profile.js");

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(200).send(null);
    }

    return res.send(profile);
  } catch (err) {
    return next(err);
  }
};

const createProfile = async (req, res, next) => {
  try {
    const existingProfile = await Profile.findOne({ userId: req.user._id });

    if (existingProfile) {
      return res.status(409).send({ message: "Profile already exists" });
    }

    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      summary,
      skills,
    } = req.body;

    const profile = await Profile.create({
      userId: req.user._id,
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      summary,
      skills,
    });

    return res.status(201).send(profile);
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      summary,
      skills,
    } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        fullName,
        email,
        phone,
        location,
        linkedin,
        github,
        portfolio,
        summary,
        skills,
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return res.send(updatedProfile);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};
const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profile");

router.get("/profile/me", auth, getProfile);
router.post("/profile", auth, createProfile);
router.patch("/profile", auth, updateProfile);

module.exports = router;
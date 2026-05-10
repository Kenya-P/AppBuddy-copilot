const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { parseResume } = require("../controllers/resume");

router.post("/resume/parse", auth, upload.single("resume"), parseResume);

module.exports = router;
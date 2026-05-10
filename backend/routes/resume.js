const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { parseResume, structureResume } = require("../controllers/resume");

router.post("/resume/parse", auth, upload.single("resume"), parseResume);
router.post("/resume/structure", auth, structureResume);

module.exports = router;
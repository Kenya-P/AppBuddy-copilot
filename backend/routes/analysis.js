const router = require("express").Router();
const auth = require("../middlewares/auth");
const { analyzeJob } = require("../controllers/analysis");

router.post("/analyze", auth, analyzeJob);

module.exports = router;
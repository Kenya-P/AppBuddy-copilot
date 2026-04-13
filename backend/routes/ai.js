const router = require("express").Router();
const auth = require("../middlewares/auth");
const { generateApplication } = require("../controllers/ai");

router.post("/generate", auth, generateApplication);

module.exports = router;
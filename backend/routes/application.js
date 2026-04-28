const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/applications");

router.post("/applications", auth, createApplication);
router.get("/applications", auth, getApplications);
router.get("/applications/:id", auth, getApplicationById);
router.patch("/applications/:id", auth, updateApplication);
router.delete("/applications/:id", auth, deleteApplication);

module.exports = router;
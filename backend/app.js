const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile")
const aiRoutes = require("./routes/ai");
const applicationRoutes = require("./routes/application");
const resumeRoutes = require("./routes/resume");
const analysisRoutes = require("./routes/analysis");

const { errorHandler } = require("./middlewares/errorHandler");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", profileRoutes);
app.use("/api", aiRoutes);
app.use("/api", applicationRoutes);
app.use("/api", resumeRoutes);
app.use("/api", analysisRoutes);

app.use(errorHandler);

module.exports = app;
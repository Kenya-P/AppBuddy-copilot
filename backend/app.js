const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile")
const { errorHandler } = require("./middlewares/errorHandler");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", profileRoutes);

app.use(errorHandler);

module.exports = app;
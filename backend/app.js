const express = require("express");
const cors = require("cors");
const dotenv = reuqire("dotenv");

dotenv.config();

const userRoutes = require("./routes/users");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.use(errorHandler);
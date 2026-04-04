const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const mongoose = require("mongoose");

const {
  PORT = 3001,
  MONGO_URI = "mongodb://127.0.0.1:27017/AppBuddy-copilot",
} = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
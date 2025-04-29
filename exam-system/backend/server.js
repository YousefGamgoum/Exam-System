const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const AppError = require("./utils/AppError");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/exam-system")
  .then(() => {
    console.log("connect to mongodb");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use("/users", userRoutes);

// not found
app.use((req, res, next) => {
  next(new AppError(404, "Route Not Found"));
});

// error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message || "Try again later!",
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`server started listen port ${port}`);
});

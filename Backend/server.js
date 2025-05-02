
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const examRoutes = require("./Routes/examRoutes");
const resultRoutes = require("./Routes/resultRoutes");

const AppError = require("./utils/AppError");
const examsRoutes = require("./Routes/examRoutes");
dotenv.config();
const app = express();
app.use(cors());
// Middleware to parse JSON
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

// routes
app.use("/users", userRoutes);
app.use("/exams", examRoutes);
app.use("/results", resultRoutes);
// not found
app.use((req, res, next) => {
  next(new AppError(404, "Route Not Found"));
});


// Error MiddleWare
app.use((err, req, res, next) => {
  let message;
  let statusCode;

  // Mongoose CastError
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }
  // Mongoose duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    statusCode = 400;
  }

  // Mongoose ValidationError
  else if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation failed: ${errors.join(", ")}`;
    statusCode = 400;
  }

  // JWT Error
  else if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
  }

  // JWT expired
  else if (err.name === "TokenExpiredError") {
    message = "Your token has expired. Please log in again.";
    statusCode = 401;
  }

  //  Other Error
  else {
    message = err.message || "Try again later";
    statusCode = err.statusCode || 500;
  }

  res.status(statusCode).json({
    status: "Fail",
    message,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`server started listen port ${port}`);
});


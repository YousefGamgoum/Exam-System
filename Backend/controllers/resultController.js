
const Result = require("../Models/Results");
const AppError = require("../Utils/AppError");
const { catchAsync } = require("../Utils/catchAsync");

exports.getUserResults = catchAsync(async (req, res, next) => {
  if (!req.id) {
    return next(new AppError(401, "Please login to view your results"));
  }

  const results = await Result.find({ user: req.id })
    .populate("exam")
    .populate({
      path: "user",
      select: "username",
    });

  const formattedResults = results.map((result) => ({
    _id: result._id,
    exam: result.exam,
    score: result.score,
    createdAt: result.createdAt,
    userName: result.user ? result.user.username : "Unknown User",
  }));

  res.status(200).json({ status: "success", data: formattedResults });
});

exports.getAllStudentResults = catchAsync(async (req, res, next) => {
  const results = await Result.find().populate("exam").populate({
    path: "user",
    select: "username",
  });

  const formattedResults = results.map((result) => ({
    _id: result._id,
    examName: result.exam ? result.exam.name : "Unknown Exam",
    score: result.score,
    createdAt: result.createdAt,
    userName: result.user ? result.user.username : "Unknown User",
  }));

  res.status(200).json({ status: "success", data: formattedResults });
});

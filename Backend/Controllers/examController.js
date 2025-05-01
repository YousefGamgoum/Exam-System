const { catchAsync } = require("../utils/catchAsync");

const Exam = require("../Models/Exams");
const Result = require("../Models/Results");
const User = require("../Models/Users");
const AppError = require("../utils/appError");

exports.getExamdetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exams = await Exam.findById(id);
  if (!exams) {
    return next(new AppError(404, "Exam not found"));
  }
  res.status(200).json({
    status: "success",
    data: exams,
  });
});

exports.getExamResultById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  const results = await Result.aggregate([
    {
      $match: { exam: exam._id },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        score: 1,
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
  ]);
  if (exam.length === 0) {
    return next(new AppError(404, "Exam not found"));
  }
  res.status(200).json({
    status: "success",
    data: {
      exam: {
        _id: exam._id,
        name: exam.name,
        description: exam.description,
        totalMarks: exam.totalMarks,
        questionCount: exam.questionCount,
      },
      results,
    },
  });
});

exports.updateExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, questions } = req.body;
  const exam = await Exam.findByIdAndUpdate(
    id,
    { name, description, questions },
    { new: true, runValidators: true }
  );
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

exports.deleteExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }
  res.status(200).json({
    status: "success",
    message: "Exam deleted successfully",
  });
});

exports.createExam = catchAsync(async (req, res, next) => {
  const { name, description, questions } = req.body;
  const exam = await Exam.create({ name, description, questions });
  res.status(201).json({
    status: "success",
    data: exam,
  });
});

exports.getStudentsResults = catchAsync(async (req, res, next) => {
  const results = await Result.find()
    .populate({
      path: "user",
      select: "name email ",
    })
    .populate({
      path: "exam",
      select: "name totalMarks questionCount",
    });

  // if (results.length === 0) {
  //   return next(new AppError(404, "No results found"));
  // }
  res.status(200).json({
    status: "success",
    data: results,
  });
});

exports.getExams = catchAsync(async (req, res, next) => {
  const exams = await Exam.aggregate([
    {
      $project: {
        _id: 1,
        name: 1,
        questionCount: 1,
        totalMarks: 1,
      },
    },
  ]);

  let examResults = [];
  for (let exam of exams) {
    const results = await Result.aggregate([
      {
        $match: { exam: exam._id },
      },
      {
        $group: { _id: "$exam", count: { $sum: 1 } },
      },
    ]);
    const examWithResults = {
      ...exam,
      submissionCount: results.length > 0 ? results[0].count : 0,
    };
    examResults.push(examWithResults);
  }
  res.status(200).json({
    status: "success",
    data: {
      examResults: examResults,
    },
  });
});

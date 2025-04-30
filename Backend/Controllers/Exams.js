const { catchAsync } = require("../utils/catchAsync");

const Exam = require("../Models/Exams");
const Result = require("../Models/Results");

exports.getAllExams = catchAsync(async (req, res, next) => {
  const exams = await Exam.find();
  res.status(200).json({
    status: "success",
    data: exams,
  });
});

exports.getExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

exports.updateExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, questions } = req.body;
  const exam = await Exam.findByIdAndUpdate(
    id,
    { name, description, questions },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: exam,
  });
});

exports.deleteExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Exam.findByIdAndDelete(id);
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
      select: "name email",
    })
    .populate({
      path: "exam",
      select: "name totalMarks",
    });

  res.status(200).json({
    status: "success",
    data: results,
  });
});

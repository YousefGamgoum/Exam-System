const Exam = require("../models/exam");
const Result = require("../models/result");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

// get all exams
exports.getAllExams = catchAsync(async (req, res, next) => {
  // Get all exams
  const exams = await Exam.find().select("name description totalMarks");

  if (!exams.length) {
    return next(new AppError(404, "No available exams"));
  }

  // If the user is an admin, return all exams
  if (req.role === "admin") {
    return res.status(200).json({ status: "success", data: exams });
  }

  // For students, filter out exams they have already taken
  const userResults = await Result.find({ user: req.id }).select("exam");
  const takenExamIds = userResults.map((result) => result.exam.toString());

  // Filter exams to exclude the ones the student has taken
  const availableExams = exams.filter(
    (exam) => !takenExamIds.includes(exam._id.toString())
  );

  if (!availableExams.length) {
    return next(new AppError(404, "No available exams for you"));
  }

  res.status(200).json({ status: "success", data: availableExams });
});

// Get exam by ID
exports.getExamById = catchAsync(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

  res.status(200).json({ status: "success", data: exam });
});

// Submit exam answers and calculate score
exports.submitExam = catchAsync(async (req, res, next) => {
  const { examId, answers } = req.body;

  // Check if user is authenticated
  if (!req.id) {
    return next(new AppError(401, "Please login to submit the exam"));
  }

  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

  let score = 0;
  exam.questions.forEach((question, index) => {
    const userAnswer = answers.find((ans) => ans.questionIndex === index);
    if (userAnswer) {
      const selectedChoice = question.choices[userAnswer.selectedChoiceIndex];
      if (selectedChoice && selectedChoice.isCorrect) {
        score += question.marks;
      }
    }
  });

  // Save the result
  const result = await Result.create({
    user: req.id,
    exam: examId,
    score,
  });

  res.status(201).json({ status: "success", data: { score, result } });
});

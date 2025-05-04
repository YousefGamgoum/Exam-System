const Exam = require("../Models/Exams");
const Result = require("../Models/Results");
const AppError = require("../Utils/AppError");
const { catchAsync } = require("../Utils/catchAsync");
const User = require("../Models/user");

exports.getExamdetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exams = await Exam.findById(id);
  if (!exams) {
    return next(new AppError(404, "Exam not found"));
  }
  if (!exams.available) {
    return next(new AppError(404, "Exam is not available"));
  }
  res.status(200).json({
    status: "success",
    data: exams,
  });
});

exports.getExamResultById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);

  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

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
    {
      $project: {
        _id: 1,
        user: 1,
        score: 1,
        createdAt: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      exam: {
        _id: exam._id,
        name: exam.name,
        description: exam.description,
        totalMarks: exam.totalMarks,
        questionCount: exam.questionCount,
        available: exam.available,
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

// get all exams
exports.getAllExams = catchAsync(async (req, res, next) => {
  // Get all exams
  const exams = await Exam.find({ available: true }).select(
    "name description totalMarks questionCount"
  );

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

// Get all exams for admin without filtering
exports.getAllExamsAdmin = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.role !== "admin") {
    return next(
      new AppError(403, "You don't have permission to access this resource")
    );
  }

  const exams = await Exam.find().select(
    "name description totalMarks questionCount"
  );

  if (!exams.length) {
    return res.status(200).json({
      status: "success",
      data: [],
      message: "No exams found",
    });
  }

  res.status(200).json({ status: "success", data: exams });
});

// Get exam by ID
exports.getExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }
  if (!exam.available) {
    return next(new AppError(404, "Exam is not available"));
  }

  res.status(200).json({ status: "success", data: exam });
});

exports.deleteExamById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }

  exam.available = false;
  await exam.save();

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
      select: "email username",
    })
    .populate({
      path: "exam",
      select: "name totalMarks questionCount available",
    })
    .sort({ createdAt: -1 });

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
        available: 1,
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
  if (!exam.available) {
    return next(new AppError(404, "Exam is not available"));
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

exports.enableExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const exam = await Exam.findById(id);
  if (!exam) {
    return next(new AppError(404, "Exam not found"));
  }
  exam.available = true;
  await exam.save();
  res.status(200).json({
    status: "success",
    message: "Exam enabled successfully",
  });
});

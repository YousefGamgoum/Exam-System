const express = require("express");
const {
  getAllExams,
  getExamById,
  submitExam, // New controller for submitting exams
} = require("../controllers/examController");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getAllExams);
router.get("/:id", auth, getExamById);
router.post("/submit", auth, submitExam);

// router.post("/", auth, restrictTo("admin"), createExam);
// router.put("/:id", auth, restrictTo("admin"), updateExam);
// router.delete("/:id", auth, restrictTo("admin"), deleteExam);

module.exports = router;

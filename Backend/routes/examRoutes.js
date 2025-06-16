const express = require("express");
const router = express.Router();
const {
  getAllExams,
  getExamById,
  submitExam,
  getStudentsResults,
  createExam,
  getExams,
  getExamdetails,
  getExamResultById,
  updateExamById,
  deleteExamById,
  enableExam,
} = require("../controllers/examController");
const { auth, restrictTo } = require("../Middlewares/auth");

router.get("/", auth, getAllExams);
router.get("/all", getExams);
router.get("/students-results", getStudentsResults);
router.get("/:id", auth, getExamById);
router.post("/submit", auth, submitExam);
router.post("/:id/enable", enableExam);
// router.use(userRoleDetect("admin", "student"));

// router.use(userRoleDetect("admin"));

router.post("/create", createExam);

router.get("/:id/exam", getExamdetails);
router.get("/:id/exam-result", getExamResultById);
router.put("/:id", updateExamById);
router.delete("/:id", deleteExamById);
// router.get("/:id/results", getExamResults);

// router.post("/", auth, restrictTo("admin"), createExam);
// router.put("/:id", auth, restrictTo("admin"), updateExam);
// router.delete("/:id", auth, restrictTo("admin"), deleteExam);

module.exports = router;

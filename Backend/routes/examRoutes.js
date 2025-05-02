const {
  getExamResultById,
  updateExamById,
  deleteExamById,
  createExam,
  getStudentsResults,
  getExams,
  getExamdetails,
} = require("../Controllers/examController");

const { userRoleDetect } = require("../Middlewares/auth");
const router = require("express").Router();

// router.use(userRoleDetect("admin", "student"));

// router.use(userRoleDetect("admin"));
router.get("/students-results", getStudentsResults);
router.post("/create", createExam);
router.get("/all", getExams);
router.get("/:id/exam", getExamdetails);
router.get("/:id", getExamResultById);
router.put("/:id", updateExamById);
router.delete("/:id", deleteExamById);
// router.get("/:id/results", getExamResults);

module.exports = router;

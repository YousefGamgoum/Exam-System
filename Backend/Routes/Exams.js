const {
  getAllExams,
  getExamById,
  updateExamById,
  deleteExamById,
  createExam,
  getStudentsResults,
} = require("../Controllers/Exams");

const { userRoleDetect } = require("../Middlewares/auth");
const router = require("express").Router();

// router.use(userRoleDetect("admin", "student"));
router.get("/", getAllExams);

// router.use(userRoleDetect("admin"));
router.get("/students-results", getStudentsResults);
router.post("/create", createExam);
router.get("/:id", getExamById);
router.put("/:id", updateExamById);
router.delete("/:id", deleteExamById);

module.exports = router;

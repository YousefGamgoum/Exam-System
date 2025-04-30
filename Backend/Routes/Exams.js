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

router.get("/", getAllExams);
router.get("/students-results", getStudentsResults);
router.post("/create", createExam);

// router.use(userRoleDetect("admin"));
router.get("/:id", getExamById);
router.put("/:id", updateExamById);
router.delete("/:id", deleteExamById);

module.exports = router;

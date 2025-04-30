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
router.get("/:id", getExamById);

router.use(userRoleDetect("admin"));
router.put("/:id", updateExamById);
router.delete("/:id", deleteExamById);
router.post("/create", createExam);
router.get("/students-results", getStudentsResults);

module.exports = router;

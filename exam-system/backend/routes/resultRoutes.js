const express = require("express");

const {
  getUserResults,
  getAllStudentResults,
} = require("../controllers/resultController");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

// Student route to view their results
router.get("/my-results", auth, getUserResults);
router.get("/all", auth, restrictTo("admin"), getAllStudentResults);

module.exports = router;

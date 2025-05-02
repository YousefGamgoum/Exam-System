const express = require("express");

const {
  getUserResults,
  getAllStudentResults,
} = require("../Controllers/resultController");
const { auth, restrictTo } = require("../Middlewares/auth");

const router = express.Router();

// Student route to view their results
router.get("/my-results", auth, getUserResults);
router.get("/all", auth, restrictTo("admin"), getAllStudentResults);

module.exports = router;

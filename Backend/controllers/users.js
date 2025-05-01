
const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");

// register
exports.register = catchAsync(async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({
      status: "fail",
      message: "Username, email, and password are required",
    });
  }

  let user = await userModel.create({
    username: req.body.username.trim().toLowerCase(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
    role: "student",
  });

  res.status(200).json({
    status: "success",
    message: "Registration successful",
  });
});

//login
exports.login = catchAsync(async (req, res) => {
  //   no write email or pass
  if (!req.body.email || !req.body.password) {
    return res.status(404).json({
      status: "fail",
      message: "you must provide email and password to login ",
    });
  }

  //   search email
  let user = await userModel.findOne({ email: req.body.email });

  //   invalid email or no register
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invaild email or password",
    });
  }

  //   if vaild email , compare pass
  let isvalid = await user.comparePassword(req.body.password);
  if (!isvalid) {
    return res.status(401).json({
      status: "fail",
      message: "Invaild email or password",
    });
  }

  // if valid email and pass , create token
  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );

  res.status(200).json({
    status: "success",
    token,
    role: user.role,
  });
});

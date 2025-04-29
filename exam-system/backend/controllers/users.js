const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");

// register
exports.register = catchAsync(async (req, res) => {
  let user = await userModel.create(req.body);

  res.status(200).json({
    status: "success",
    message: "Registration successfuly",
    data: user,
  });
});

//login
exports.login = catchAsync(async (req, res) => {
  let { email, password } = req.body;

  //   no write email or pass
  if (!email || !password) {
    return res.status(404).json({
      status: "fail",
      message: "you must provide email and password to login ",
    });
  }

  //   search email
  let user = await userModel.findOne({ email });

  //   invalid email or no register
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invaild email or password",
    });
  }

  //   if vaild email , compare pass
  let isvalid = await bcryptjs.compare(password, user.password);
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
    data: user,
  });
});

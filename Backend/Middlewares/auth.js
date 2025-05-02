const { json } = require("express");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/AppError");
const { catchAsync } = require("../Utils/catchAsync");

exports.auth = catchAsync(function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    return next(new AppError(401, "Please login first"));

  //   Token verification
  const token = authorization.split(" ")[1];
  let decoded = jwt.verify(token, process.env.SECRET);
  console.log(decoded);

  req.id = decoded.id;
  req.role = decoded.role;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role))
      return next(new AppError(403, "you don't have permission"));
    else next();
  };
};

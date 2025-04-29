const { json } = require("express");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.auth = catchAsync(function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return next(new AppError(401, "Please login first"));

  //   Token verification
  let decoded = jwt.verify(authorization, process.env.SECRET);
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

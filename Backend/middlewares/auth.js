
const AppError = require("../utils/appError");


exports.userRoleDetect = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(new AppError(403, "You don't have permission"));
    } else {
      next();
    }
  };
};

const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getProfileData = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The user belonging to this token no longer exists", 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

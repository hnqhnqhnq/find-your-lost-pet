const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-__v");

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getProfileData = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    console.log("No JWT found in cookies.");
    return next(new AppError("User is not logged in", 401));
  }

  try {
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("No user found with the provided ID.");
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
  } catch (err) {
    console.error("Error during token verification or user retrieval:", err);
    return next(new AppError("Internal server error", 500));
  }
});

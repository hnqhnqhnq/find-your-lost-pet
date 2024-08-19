const { promisify } = require("util");
const multer = require("multer");
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
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

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

exports.changeUserInfo = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findByIdAndUpdate(decoded.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    decoded.id,
    { photo: `/uploads/profile_pictures/${req.file.filename}` },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

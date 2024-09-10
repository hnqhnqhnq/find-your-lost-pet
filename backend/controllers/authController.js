const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(
      new AppError("Your token has expired. Please log in again!", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
    loggedIn: true,
  });
});

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.setHeader("Cache-Control", "no-store");
  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.signout = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    status: "success",
    message: "Logged out successfully!",
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    country: req.body.country,
    city: req.body.city,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Enter the credentials", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.changeUserPassword = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(
      new AppError("Your token has expired. Please log in again!", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id).select("+password");
  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  if (
    !req.body.oldPassword ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return next(new AppError("Submit the necessary data", 401));
  }

  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("Old password is incorrect", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address"), 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log("sent");

  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetPassword/${resetToken}`;

  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;

  const message = `
  <p>Forgot your password? Click the link below to reset it:</p>
  <a href="${resetURL}" target="_blank">Click here to reset your password</a>
  <p>If you didn’t request a password reset, please ignore this email.</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid 10 minutes)",
      message,
      html: message,
    });
    console.log("sent");
  } catch (err) {
    console.error("Error sending email:", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("there was an error sending the email. Try again later!"),
      500
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password successfully updated!",
  });
});

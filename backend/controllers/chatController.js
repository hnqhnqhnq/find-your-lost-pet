const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Chat = require("./../models/chatModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createChat = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  const existingChat = await Chat.findOne({
    $or: [
      {
        firstParticipant: req.params.user1,
        secondParticipant: req.params.user2,
      },
      {
        firstParticipant: req.params.user2,
        secondParticipant: req.params.user1,
      },
    ],
  });

  if (existingChat) {
    return next(new AppError("Chat already exists", 400));
  }

  const chat = await Chat.create({
    firstParticipant: req.params.user1,
    secondParticipant: req.params.user2,
  });

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  const chats = await Chat.find({
    $or: [{ firstParticipant: user._id }, { secondParticipant: user._id }],
  }).populate([
    { path: "firstParticipant", select: "firstName lastName photo" },
    { path: "secondParticipant", select: "firstName lastName photo" },
  ]);
  if (chats.length === 0) {
    return next(new AppError("No chats found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      chats,
    },
  });
});

const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Chat = require("./../models/chatModel");
const User = require("./../models/userModel");
const Message = require("./../models/messageModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createMessage = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const { receiverId, chatId } = req.params;
  const content = req.body.content;

  const message = await Message.create({
    chat: chatId,
    sender: decoded.id,
    receiver: receiverId,
    content: content || "",
  });

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("You are not logged in!", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new AppError("Chat not found!", 404));
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "firstName lastName photo")
    .populate("receiver", "firstName lastName photo")
    .sort({ messageAt: 1 });

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});

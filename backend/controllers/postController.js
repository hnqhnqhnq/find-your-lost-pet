const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const upload = require("./../utils/multerConfigPosts");

exports.uploadPostPhotos = upload.array("photos", 5);

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate(
    "createdBy",
    "firstName lastName photo"
  );

  if (!posts) {
    return next(new AppError("Could not find any posts", 404));
  }

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const photos = req.files
    ? req.files.map((file) => `/uploads/posts/${file.filename}`)
    : [];

  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    createdBy: decoded.id,
    photos: photos,
  });

  if (!post) {
    return next(new AppError("Could not create post", 400));
  }

  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

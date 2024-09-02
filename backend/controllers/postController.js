const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const upload = require("./../utils/multerConfigPosts");

exports.uploadPostPhotos = upload.array("photos", 5);

exports.getAllPosts = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const posts = await Post.find({ active: true })
    .populate("createdBy", "firstName lastName photo")
    .sort({ postedAt: -1 });

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

exports.deletePost = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Not found!", 404));
  }

  post.active = false;
  await post.save();

  res.status(204).json({
    status: "success",
    data: null,
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
    country: req.body.country,
    city: req.body.city,
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

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  const newComment = {
    content,
    commentedBy: decoded.id,
  };

  post.comments.push(newComment);
  await post.save();

  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

exports.getCommentsForAPost = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const { postId } = req.params;

  const post = await Post.findById(postId).populate(
    "comments.commentedBy",
    "firstName lastName photo"
  );

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      count: post.comments.length,
      comments: post.comments,
    },
  });
});

exports.getPostsOfUser = catchAsync(async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new AppError("User is not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  const { userId } = req.params;

  const posts = await Post.find({ createdBy: userId, active: true })
    .populate([
      {
        path: "createdBy",
        select: "firstName lastName photo",
      },
      {
        path: "comments.commentedBy",
        select: "firstName lastName photo",
      },
    ])
    .sort({ postedAt: -1 });

  if (!posts || posts.length === 0) {
    return next(new AppError("No posts available!", 404));
  }

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: {
      posts,
    },
  });
});

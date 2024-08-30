const express = require("express");
const postController = require("./../controllers/postController");

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.uploadPostPhotos, postController.createPost);

router
  .route("/:postId/comments")
  .post(postController.createComment)
  .get(postController.getCommentsForAPost);

module.exports = router;

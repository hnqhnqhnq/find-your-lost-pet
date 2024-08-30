const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  content: {
    type: String,
    required: [true, "Please provide content for the post"],
  },
  photos: {
    type: [String],
  },
  postedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Document middleware
postSchema.pre("save", function (next) {
  if (!this.isNew) {
    next();
  }

  this.postedAt = new Date();
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

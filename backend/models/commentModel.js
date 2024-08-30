const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, "Cannot post an empty comment!"],
  },
  commentedAt: {
    type: Date,
  },
  commentedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Document middleware
commentSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next();
  }

  this.commentedAt = new Date();
  next();
});

module.exports = commentSchema;

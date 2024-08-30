const mongoose = require("mongoose");
const commentSchema = require("./commentModel");
const {
  countries,
  citiesOfCountries,
} = require("./../utils/countriesAndCitiesParsing");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  content: {
    type: String,
    required: [true, "Please provide content for the post"],
  },
  country: {
    type: String,
    enum: [...countries],
    required: [true, "You must choose your country"],
  },
  city: {
    type: String,
    required: [true, "You must choose your city"],
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
  comments: {
    type: [commentSchema],
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

const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name."],
    validate: [validator.isAlpha, "Please tell us your valid first name."],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name."],
    validate: [validator.isAlpha, "Please tell us your valid last name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address."],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address."],
    unique: [true, "Please provide another email address."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password."],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
  photo: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

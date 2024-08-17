const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name.\n"],
    validate: [validator.isAlpha, "Please tell us your valid first name.\n"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name.\n"],
    validate: [validator.isAlpha, "Please tell us your valid last name.\n"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email address.\n"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address.\n"],
    unique: [true],
  },
  password: {
    type: String,
    required: [true, "Please provide a password.\n"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password.\n"],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.\n",
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
  createdAt: {
    type: Date,
    select: false,
  },
});

// Document middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isNew) {
    next();
  }

  this.createdAt = new Date();
  next();
});

// Methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

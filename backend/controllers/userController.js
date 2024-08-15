const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      result: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err.message);

    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    console.log(err.message);

    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signupUser").post(authController.signup);
router.route("/loginUser").post(authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;

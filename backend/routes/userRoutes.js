const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signupUser").post(authController.signup);
router.route("/loginUser").post(authController.login);
router.route("/isLoggedIn").get(authController.isLoggedIn);
router.route("/signoutUser").get(authController.signout);

router.route("/myProfile").get(userController.getProfileData);

module.exports = router;

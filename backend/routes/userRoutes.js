const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signupUser").post(authController.signup);
router.route("/loginUser").post(authController.login);
router.route("/isLoggedIn").get(authController.isLoggedIn);
router.route("/signoutUser").get(authController.signout);
router.route("/changePassword").patch(authController.changeUserPassword);

router.route("/myProfile").get(userController.getProfileData);
router.route("/changeUserData").patch(userController.changeUserInfo);

router.route("/").get(userController.getAllUsers);

module.exports = router;

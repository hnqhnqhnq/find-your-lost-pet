const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const upload = require("./../utils/multerConfig");

const router = express.Router();

router.route("/signupUser").post(authController.signup);
router.route("/loginUser").post(authController.login);
router.route("/isLoggedIn").get(authController.isLoggedIn);
router.route("/signoutUser").get(authController.signout);
router.route("/changePassword").patch(authController.changeUserPassword);

router.route("/myProfile").get(userController.getProfileData);
router.route("/changeUserData").patch(userController.changeUserInfo);
router
  .route("/updateProfilePicture")
  .post(upload.single("profilePic"), userController.updateProfilePhoto);

router.route("/search").get(userController.searchUser);

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUserByID);

module.exports = router;

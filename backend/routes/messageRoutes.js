const express = require("express");
const messageController = require("./../controllers/messageController");

const router = express.Router();

router
  .route("/:receiverId/:chatId")
  .post(messageController.uploadMediaFiles, messageController.createMessage);

router.route("/:chatId").get(messageController.getMessages);

module.exports = router;

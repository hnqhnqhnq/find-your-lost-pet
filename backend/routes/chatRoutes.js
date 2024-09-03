const express = require("express");
const chatController = require("./../controllers/chatController");

const router = express.Router();

router.route("/:user1/:user2").post(chatController.createChat);

router.route("/").get(chatController.getChats);

module.exports = router;

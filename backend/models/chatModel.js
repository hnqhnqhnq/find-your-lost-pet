const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  firstParticipant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  secondParticipant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastMessage: {
    type: String,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

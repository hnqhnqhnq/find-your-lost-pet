const mongoose = require("mongoose");
const Chat = require("./chatModel");

const messageSchema = mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: [true, "Message content is required"],
  },
  mediaFiles: {
    type: [String],
  },
  messageAt: {
    type: Date,
    default: Date.now(),
  },
});

messageSchema.pre("save", async function (next) {
  try {
    await Chat.findByIdAndUpdate(this.chat, {
      lastMessage: this.content,
      lastMessageAt: Date.now(),
    });
    next();
  } catch (err) {
    next(err);
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

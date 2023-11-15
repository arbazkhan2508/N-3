var mongoose = require("mongoose");

var chatSchema = mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    reciever_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);

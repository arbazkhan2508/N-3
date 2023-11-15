const mongoose = require('mongoose')
var chatSchema = mongoose.Schema({
  firstUser: mongoose.Types.ObjectId,
  secondUser: mongoose.Types.ObjectId,
  roomId: String,
  chats: [
    {
      messageType: String,
      data: String,
    },
  ],
})
module.exports = mongoose.model('chat', chatSchema)

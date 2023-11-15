const mongoose = require('mongoose')

let commentSchema = mongoose.Schema({
  data: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'post',
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
  ],
  replyOf: {
    type: mongoose.Types.ObjectId,
    ref: 'comment',
  },
  replies: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'comment',
    },
  ],
})

module.exports = mongoose.model('comment', commentSchema)

const mongoose = require('mongoose')

let storySchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  mension: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  caption: String,
  post: String,
  ext:String,
  location:String,
  uploadTime:String,  
},{timestamps:true,})


module.exports = mongoose.model('story', storySchema)

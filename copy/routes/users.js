const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
mongoose.connect("mongodb://0.0.0.0/insta").then(function (connected) {
  console.log("connected!");
});

let userSchema = mongoose.Schema({
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  Bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  userProfileimg: String,
  dob: {
    type: Date,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  token:{
    type: String,
    default: ""
   },
  expiringTime:String,
  Caption: String,
  chats: {
    type: Map,
    of: Object,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "story",
    },
  ],
  reels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  Comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
 password: String,
});
userSchema.plugin(plm, { usernameField: "email" });
userSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", userSchema);

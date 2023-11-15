var mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/agridm1")
.then(function(created){
  console.log("created!");
});

var userSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    profileimg:String,
    profileimg:{
      type:Array,
      default:[]
     },
    name:String
});

userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);
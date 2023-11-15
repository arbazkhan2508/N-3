const mongoose = require('mongoose');

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/googleak');

var userSchema = mongoose.Schema({
  name:String,
  email:String
})

module.exports = mongoose.model('user',userSchema);
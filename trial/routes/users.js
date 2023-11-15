const mongoose = require('mongoose');
mongoose.connect("mongodb://0.0.0.0/trial")
  .then(function (connected) {
    console.log("connected!");
  })
  .catch((err) => {
    console.log(err);
  });
const fileSchema = new mongoose.Schema({
  filename: String
});

const File = mongoose.model('File', fileSchema);

module.exports = File;

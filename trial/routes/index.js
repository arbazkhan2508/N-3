var express = require('express');
var router = express.Router();


const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const conn = mongoose.connection;

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle file upload
router.post('/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  // Iterate through the uploaded files and store them in GridFS
  req.files.forEach((file) => {
    const writestream = gfs.createWriteStream({
      filename: file.originalname
    });

    writestream.on('finish', (file) => {
      console.log(`File ${file.filename} saved.`);
    });

    writestream.write(file.buffer);
    writestream.end();
  });

  res.redirect('/');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

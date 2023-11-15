var express = require('express');
var router = express.Router();
const upload = require('./grid');
var usermodel = require('./users');
var passport = require('passport');
var multer = require('multer');
var path = require('path');
var gridfsStream = require('gridfs-stream');
var mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
var connect = mongoose.connection;

let gfs  
let gfsBucket

connect.once('open', function(){
 gfs = gridfsStream(connect.db,mongoose.mongo)
 gfs.collection('uploads')
 gfsBucket = new mongoose.mongo.GridFSBucket(connect.db,{
  bucketName: 'uploads',
 })
})


const localstrategy = require("passport-local");
const { url } = require('inspector');
passport.use(new localstrategy(usermodel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('filename'), function (req, res) {
  usermodel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      user.profileimg = req.file.filename;
      user.save()
        .then(function () {
          res.redirect("/input");
        })
    })
});

// Input page
router.get('/input', (req, res) => {
  res.render('inout');
});

// Form submit route
router.post('/submit', (req, res) => {
  usermodel.findOne({ username: req.session.passport.user })
  .then(function(user){
      user.name = req.body.name;
      user.save()
      .then(function(){
          res.redirect('/profile');
      })
  })
  // const inputData = req.body;
  // // Process the input data here

  // // Redirect to a success page or perform any other action
  // res.send('Form submitted successfully!');
});

router.get("/getFile/:filename", function (req, res) {
  gfs.files.findOne({filename:req.params.filename}).then(function (){
  })
  gfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
})


router.post('/register', function (req, res) {
  var data = new usermodel({
    username: req.body.username,
    email: req.body.email,
  })
  usermodel.register(data, req.body.password)
    .then(function (e) {
      passport.authenticate('local')(req, res, function () {
        res.redirect("/profile");
      })
    })
});


router.get('/login', function (req, res) {
  res.render('login');
})

router.get('/profile', isLoggedIn, function (req, res) {
  usermodel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      res.render('profile', { user });
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function (req, res) { });

router.get('/logout', isLoggedIn, function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/")
  }
}


module.exports = router;

const express = require('express');
const router = express.Router();
const usermodal = require('./users.js')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');

require('dotenv').config()

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['email','profile' ]
},async function verify(issuer, profile, cb) {
      console.log(profile);
      let user = await usermodal.findOne({email:profile.emails[0].value})
      if(user){
          return cb(null,user)
      }else{

          let newUser = await usermodal.create({name:profile.displayName,email:profile.emails[0].value})
          newUser.save();
          return cb(null,newUser);
      }

}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get('/profile',async function(req, res, next) {
  let user = await usermodal.findOne({name:req.user.username})
  res.render('profile',{user});
});


router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));


module.exports = router;

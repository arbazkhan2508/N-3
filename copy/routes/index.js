var express = require("express");
var router = express.Router();
var userModel = require("./users");
const passport = require("passport");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const commentModel = require("./comment.js");
var gridfsStream = require("gridfs-stream");
var mongoose = require("mongoose");
const postModel = require("./post.js");
const storyModel = require("./story.js");
var chatModel = require("./chat");
var FacebookStrategy = require("passport-facebook");
require("dotenv").config();
const mailer = require('../nodemailer')
const { GridFsStorage } = require("multer-gridfs-storage");
const { uploadposts, uploadprofile, uploadstory } = require("./grid");
const findOrCreate = require("mongoose-findorcreate");
var connect = mongoose.connection;

var db = mongoose.connection.db;

// fb oauth2


passport.use(new FacebookStrategy({
  clientID:  process.env.FACEBOOK_APP_ID,
  clientSecret:  process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile,"profile is");
  userModel.findOrCreate({ name:profile.displayName }, function (err, user) {
    return cb(err, user);
  });
}
));


router.get('/auth/facebook',
passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/home');
});

router.get('/auth/facebook',
passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] }));

router.get('/auth/facebook',
passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['user_friends', 'manage_pages'] }));

// fb oauth

/* GET home page. */


const localStrategy = require("passport-local");
const { log } = require("console");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");

// passport.use(new localStrategy(userModel.authenticate()));

passport.use(new localStrategy(
    {
      usernameField: "email",
      usernameQueryFields: ["email"],
    },
    userModel.authenticate()
  )
);

let gfs;
let gfsposts;
let gfsStory;
let gfsBucket;
let gfsBucketposts;
let gfsBucketStory;

connect.once("open", function () {
  gfs = gridfsStream(connect.db, mongoose.mongo);
  gfsposts = gridfsStream(connect.db, mongoose.mongo);
  gfsStory = gridfsStream(connect.db, mongoose.mongo);
  gfs.collection("profile");
  gfsposts.collection("posts");
  gfsStory.collection("story");
  gfsBucket = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "profile",
  });
  gfsBucketposts = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "posts",
  });
  gfsBucketStory = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "story",
  });
});

// posts upload grid fs

router.post(
  "/userprofileimg",
  uploadprofile.single("filenames"),
  async function (req, res) {
    let user = await userModel.findOne({ username: req.user.username });
    user.userProfileimg = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

router.post("/uploadpost",uploadposts.single("posts"),
  async function (req, res) {
    let user = await userModel.findOne({ username: req.user.username });
    var uri = req.file.filename;
    var extension = uri.substring(uri.lastIndexOf(".") + 1);
    let userPosts = await postModel.create({
      post: req.file.filename,
      owner: user._id,
      // caption:req.body.caption,
      // location:req.body.location,
      ext: extension,
    });
    if (extension === "mp4") {
      user.posts.push(userPosts);
      user.reels.push(userPosts);
    } else if (extension === "mkv") {
      user.posts.push(userPosts);
      user.reels.push(userPosts);
    } else {
      user.posts.push(userPosts);
    }
    await user.save();
    // let postone = userPosts;
    res.redirect("back");
    // res.render("post",{postone,user}) 
  }
);

router.post("/uploadstory",
  uploadstory.single("filename"),
  async function (req, res) {
    let user = await userModel.findOne({ username: req.user.username });
    var uri = req.file.filename;
    var extension = uri.substring(uri.lastIndexOf(".") + 1);
    let userStory = await storyModel.create({
      post: req.file.filename,
      owner: user._id,
      uploadTime : Date.now(),
      // caption:req.body.caption,
      // location:req.body.location,
      ext: extension,
    });
    user.stories.push(userStory);
    await user.save();
    await userStory.save();
    res.redirect("back");
  }
);

// posts upload grid fs

//posts stream router

router.get("/getFile/:filename", function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }).then(function () {});
  gfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
});

router.get("/getpost/:filename", function (req, res) {
  gfsposts.files
    .findOne({ filename: req.params.filename })
    .then(function () {});
  gfsBucketposts.openDownloadStreamByName(req.params.filename).pipe(res);
  // console.log("post ius",req.params.filename );
});

router.get("/getstory/:filename", function (req, res) {
  gfsStory.files
    .findOne({ filename: req.params.filename })
    .then(function () {});
  gfsBucketStory.openDownloadStreamByName(req.params.filename).pipe(res);
  // console.log("post ius",req.params.filename );
  // console.log("post ius" );
});

//delete post

router.get("/delete/:id", async function (req, res) {
  let user = await userModel.findOne({ username: req.user.username });
  let posts = await postModel.findOne({ _id: req.params.id });
  let postFile = await gfsposts.files.findOne({ filename: posts.post });
  gfsBucketposts.delete(postFile._id);
  let post_delete = await postModel.findOneAndDelete({ _id: req.params.id });
  let index = user.posts.indexOf(req.params.id);
  user.posts.splice(index, 1);
  user.save().then(function () {
    res.redirect("back");
  });
});

//delete post

//deletestory post

router.get("/deletestory/:id", async function (req, res) {
  let user = await userModel.findOne({ username: req.user.username });
  let story = await storyModel.findOne({ _id: req.params.id });
  console.log(req.params._id ,"asaasdd");
  let postFile = await gfsStory.files.findOne({ filename: story.post });
  gfsBucketStory.delete(postFile._id);
  let post_delete = await storyModel.findOneAndDelete({ _id: req.params.id });
  let index = user.stories.indexOf(req.params.id);
  user.stories.splice(index, 1);
  user.save().then(function () {
    res.redirect("/home");
  });
});

//deletestory post

// home


router.get("/home", isLoggedIn, async function (req, res) {
  try {
    const users = await userModel.find({});
    const randomSubset = getRandomSubset(users,2); // Change 5 to the desired number of users to display
    let user = await userModel
    .findOne({ username: req.user.username })
    .populate("following")
    .populate("stories");
  let alluser = await userModel.find().populate("stories");
  let storyUsers = await userModel.find().populate("stories");
  let posts = await postModel.find().limit(8).skip(0).populate("owner");
  res.render("home", { posts: posts, user: user,storyUsers:storyUsers, alluser: randomSubset });
    // res.render('home', { users: randomSubset });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
  
});


// Function to get a random subset of users
function getRandomSubset(array, size) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

// home

// userposts
router.get("/img/:id", isLoggedIn, async function (req, res) {
  let postone = await postModel
    .findOne({ _id: req.params.id })
    .populate("owner")
    .populate({
      path: "comment",
      populate: {
        path: "owner",
      },
    })
  let user = await userModel.findOne({ username: req.user.username }).populate({
    path: "posts",
    populate: {
      path: "owner",
    },
  }).populate({
      path:"posts",
      populate:{
           path:"comment",
           populate:{
            path:"owner",
         },
      },
      
  })
  let commentOne = await commentModel
    .findOne({_id: postone.comment })
    .populate("likes")
    .populate("owner"); 
    res.render("img", { postone, user,commentOne });
});
// userposts

// singlepost
router.get("/simg/:id", isLoggedIn, async function (req, res) {
  let postone = await postModel
    .findOne({ _id: req.params.id })
    .populate("owner")
    .populate({
      path: "comment",
      populate: {
        path: "owner",
      },
    })
  let user = await userModel.findOne({ _id:postone.owner }).populate({
    path: "posts",
    populate: {
      path: "owner",
    },
  }).populate({
      path:"posts",
      populate:{
           path:"comment",
           populate:{
            path:"owner",
         },
      },
      
  })
  let commentOne = await commentModel
    .findOne({_id: postone.comment })
    .populate("likes")
    .populate("owner"); 
  res.render("simg", { postone, user,commentOne });
});
// singlepost

// searchuserPosts
router.get("/searchuser/:id", isLoggedIn, async function (req, res) {
  let postone = await postModel
    .findOne({ _id: req.params.id })
    .populate("owner")
    .populate({
      path: "comment",
      populate: {
        path: "owner",
      },
    })
    const url = postone.owner.name;
    console.log(url,"shshshshshs");
  let user = await userModel.findOne({ _id:postone.owner }).populate({
    path: "posts",
    populate: {
      path: "owner",
    },
  }).populate({
      path:"posts",
      populate:{
           path:"comment",
           populate:{
            path:"owner",
         },
      },
      
  })
  let commentOne = await commentModel
    .findOne({_id: postone.comment })
    .populate("likes")
    .populate("owner"); 
  res.render("userimg", { postone, user,commentOne,url });
});
// searchuserPosts

// wholikePost
router.get("/liked/:id", isLoggedIn, async function (req, res) {
  let postone = await postModel
    .findOne({ _id: req.params.id })
    .populate("likes")
    .populate("owner");
  let user = await userModel.findOne({ username: req.user.username });
  res.render("likes", { postone, user });
});
// wholikePost

// wholikeComment
router.get("/likedcomment/:id", isLoggedIn, async function (req, res) {
 
  let commentOne = await commentModel
    .findOne({ _id: req.params.id })
    .populate("likes")
    .populate("owner");
  let postone = await postModel
    .findOne({  _id: commentOne.post})
    .populate("owner")
    .populate({
      path: "comment",
      populate: {
        path: "owner",
      },
  });
  let user = await userModel.findOne({ username: req.user.username });
  res.render("likecomment", { commentOne, user, postone });
});
// wholikeComment

router.get("/", isLoggedout, function (req, res) {
  res.render("login1");
});

// router.get("/stories/:id", async function (req, res) {
//   try {
//     await userModel
//       .findOne({ username: req.user.username })
//       .then(async (user) => {
//         let storyUser = await userModel
//           .findOne({ _id: req.params.id })
//           .populate({
//             path: "stories",
//             populate: {
//               path: "owner",
//             },
//           });

//         res.render("storyc", { user: user, storyUser: storyUser });
//       });
//   } catch (err) {
//     console.log(req.params.id);
//     console.log(err);
//   }
// });

router.get("/stories/:id", async function (req, res) {
  try {
   
     await userModel
      .findOne({ username: req.user.username })
      .then(async (user) => {
        let storyUser = await userModel
          .findOne({_id: req.params.id  })
          .populate({
            path: "stories",
            populate: {
              path: "owner",
            },
      });
        let allUsers = await userModel
          .find()
          .populate({
            path: "stories",
            populate: {
              path: "owner",
            },
      });
        res.render("storyc", { user: user, storyUser: storyUser,allUsers:allUsers });
      });
  } catch (err) {
    console.log(req.params.id);
    console.log(err);
  }
});

// update user
router.post("/update", isLoggedIn, function (req, res) {
  userModel
    .findOneAndUpdate(
      { username: req.user.username },
      {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        gender: req.body.gender,
        Caption: req.body.Caption,
      }
    )
    .then(function () {
      res.redirect("/profile");
    });
});

router.get("/edit", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.user.username }).then(function (data) {
    res.render("edit", { data });
  });
});

// update user
// allreels
router.get("/reels", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.user.username });
  let posts = await postModel.find().populate("owner");
  res.render("reels", { posts: posts, user: user });
})
// allreels

//userprofile page

router.get("/profile", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.user.username })
    .populate("posts")
    .populate("followers")
    .populate("following")
    .then(function (user) {
      res.render("profile", { user });
    });
});

router.get("/userreels", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.user.username })
    .populate("reels")
    .then(function (user) {
      res.render("userreels", { user });
    });
});

// Follow user

router.get("/follow/:userId", isLoggedIn, async (req, res, next) => {
  let currentUser = await userModel.findOne({ username: req.user.username });
  let followingUser = await userModel.findOne({ _id: req.params.userId });
  let index = currentUser.following.indexOf(req.params.userId);
  if (index == -1) {
    currentUser.following.push(req.params.userId);
    followingUser.followers.push(currentUser._id);
    await followingUser.save();
    await currentUser.save();
    currentUser = await userModel.findOne({ username: currentUser.username });
    res.redirect("back");
  } else {
    currentUser.following.splice(index, 1);
    followingUser.followers.splice(
      followingUser.followers.indexOf(currentUser._id),
      1
    );
    await followingUser.save();
    await currentUser.save();
    res.redirect("back");
  }
});

router.get("/remove/:userId", isLoggedIn, async (req, res, next) => {
  let currentUser = await userModel.findOne({ username: req.user.username });
  let followingUser = await userModel.findOne({ _id: req.params.userId });
  let index = currentUser.following.indexOf(req.params.userId);
  currentUser.followers.splice(index, 1);
  followingUser.following.splice(index, 1);
  await followingUser.save();
  await currentUser.save();
  currentUser = await userModel.findOne({ username: currentUser.username });
  res.redirect("back");
});

// likePost

router.get("/likepost/:postId", isLoggedIn, async (req, res, next) => {
  let currentUser = await userModel.findOne({ username: req.user.username });
  let currentPost = await postModel.findOne({ _id: req.params.postId });
  let index = currentUser.likes.indexOf(req.params.postId);
  if (index === -1) {
    currentUser.likes.push(req.params.postId);
    currentPost.likes.push(currentUser.id);
    await currentPost.save();
    await currentUser.save();
  } else {
    currentUser.likes.splice(index, 1);
    currentPost.likes.splice(currentPost.likes.indexOf(currentUser._id), 1);
    await currentPost.save();
    await currentUser.save();
  }
  res.redirect("back");
});

// likePost

// comment post

router.post("/comment/:postId", isLoggedIn, async function (req, res) {
  
  let user = await userModel.findOne({ username: req.user.username });
  let post = await postModel.findOne({ _id: req.params.postId });
  let comment = await commentModel.create({
    owner: user._id,
    data: req.body.data,
    post: req.params.postId,
  });
  user.Comment.push(comment);
  post.comment.push(comment);
  await post.save();
  await user.save();
  res.redirect("back");
});

router.get("/deletecomment/:commentId", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.user.username });
  let commentu = user.Comment.indexOf(req.params.commentId);
  let comment = await commentModel.findOneAndDelete({
    _id: req.params.commentId,
  });
  let post = await postModel.findOne({ _id: comment.post });
  let commentp = post.comment.indexOf(req.params.commentId);
  user.Comment.splice(commentu, 1);
  post.comment.splice(commentp, 1);
  await post.save();
  await user.save();
  res.redirect("back");
  res.render("img");
});

// likeComment

// savePost
router.get("/save/:postId", isLoggedIn, async (req, res, next) => {
  let currentUser = await userModel.findOne({ username: req.user.username });
  let currentPost = await postModel.findOne({ _id: req.params.postId });
  let index = currentUser.Bookmark.indexOf(req.params.postId);

  if (currentUser.Bookmark.indexOf(req.params.postId) === -1) {
    currentUser.Bookmark.push(req.params.postId);
    currentPost.Bookmark.push(currentUser._id);
    await currentPost.save();
    await currentUser.save();
  } else {
    currentUser.Bookmark.splice(index, 1);
    currentPost.Bookmark.splice(
      currentPost.Bookmark.indexOf(currentUser._id),
      1
    );
    await currentPost.save();
    await currentUser.save();
  }
  res.redirect("back");
});

router.get("/saved", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.user.username })
    .populate("Bookmark")
    .then(function (user) {
      res.render("saved", { user });
    });
});

// savePost

// likeComment

router.get("/likecomment/:commentId", isLoggedIn, async (req, res) => {
  let currentUser = await userModel.findOne({ username: req.user.username });
  let currentComment = await commentModel.findOne({
    _id: req.params.commentId,
  });
  let index = currentComment.likes.indexOf(currentUser.id);
  if (index === -1) {
    currentComment.likes.push(currentUser.id);
    await currentComment.save();
    await currentUser.save();
  } else {
    currentComment.likes.splice(
      currentComment.likes.indexOf(currentUser._id),
      1
    );
    await currentComment.save();
    await currentUser.save();
  }
  res.redirect("back");
});

// likeComment

// ritik indexjs

router.post("/searchUser", async function (req, res, next) {
  var search = "";
  if (req.body.search) {
    search = req.body.search;
  }
  var data = await userModel.find({
    username: { $regex: ".*" + search + ".*", $options: "i" },
  });
  res.status(200).send({ success: true, data: data });
});

router.get("/user/:name", async function (req, res, next) {
  const previousPage = req.params.name;
  let user = await userModel.findOne({
    username: req.user.username,
  });
  let second_user = await userModel
    .findOne({ name: req.params.name })
    .populate("posts");
  res.render("UserProfile", { user, second_user , previousPage});
});

// ritik indexjs

router.get("/sign", function (req, res) {
  res.render("sign");
});

router.get("/success", function (req, res) {
  res.send("logged in!");
});

router.get("/failed", function (req, res) {
  res.send("logged in failed!");
});

router.post("/register", function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });
  userModel.register(userdata, req.body.password).then(function (u) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/home");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/failed",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

function isLoggedout(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    return next();
  }
}

// rititk chat

router.get("/chat", isLoggedIn, function (req, res, next) {
  userModel.findOne({ username: req.user.username }).then(function (user) {
    userModel.find({ _id: { $nin: [user._id] } }).then(function (allUser) {
      res.render("chat", { user, allUser });
    });
  });
});

router.post("/savechat", async function (req, res, next) {
  var Chat = new chatModel({
    sender_id: req.body.sender_id,
    reciever_id: req.body.reciever_id,
    message: req.body.message,
  });
  var newChat = await Chat.save();
  res.status(200).send({ success: true, msg: "Chat Inserted!", data: newChat });
});


// forgot pass

router.get('/forgot', function(req, res) {
  res.render('forgot');
});



router.post('/forgot',async function(req, res){
  let user = await userModel.findOne({email:req.body.email})
  if(user){
     crypto.randomBytes(17,async function(err , buff){
       var rnstr = buff.toString("hex");
       user.token = rnstr,
       user.expiringTime = Date.now() + 3000000;
       await  user.save()
       mailer(req.body.email,user._id,rnstr)
        .then(function(){
           console.log("send mail!")
        })
     })
  }
  else{
    res.send("no account!")
  }
})

router.get('/reset/:userid/:token',async function(req, res) {
  let user = await userModel.findOne({_id:req.params.userid})
      
  if(user.token === req.params.token && user.expiringTime > Date.now()){
    
     res.render('newpass',{id:req.params.userid});
  }
  else{
     res.send("link expired!");
  }

});

router.post('/reset/:id',async function(req, res) {
 let user = await userModel.findOne({_id: req.params.id});
 user.setPassword(req.body.newpassword ,async function(){
   user.otp = "";
  await user.save()
  res.redirect('/profile')
 })
});

// forgot pass



module.exports = router;

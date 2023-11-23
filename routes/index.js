var express = require("express");
const passport = require("passport");
var router = express.Router();
const userSchema = require("./users");
const loacalStrategy = require("passport-local");
const postSchema = require("./post");
const { GridFsStorage } = require("multer-gridfs-storage");
const commentModel = require("./comments");
const multer = require("multer");
const Chat = require("../routes/chatModel");

// passport email setup
passport.use(
  new loacalStrategy(
    { usernameField: "email", passwordField: "password" },
    userSchema.authenticate()
  )
);

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

// filter images and vedios while upload
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return next();
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG) and videos (MP4, MPEG, QuickTime) are allowed."
      ),
      false
    );
  }
};

const upload = multer({ storage });

/* GET login page. */
router.get("/", async function (req, res, next) {
  if (req.user) {
    const user = await userSchema.findOne({ _id: req.user._id });
    const allUser = await userSchema.find({ _id: { $ne: req.user._id } });
    const posts = await postSchema.find({}).populate("author");
    res.render("home", { user: user, posts: posts, allUser: allUser });
  } else {
    res.render("login");
  }
});

router.get("/profile/:id", isLoggedIn, async function (req, res, next) {
  const followUser = await userSchema.findOne({_id:req.params.id})
  const user = await userSchema
    .findById(req.params.id)
    .populate("friends posts");
  const loggedInUser = await userSchema.findById(req.user._id);
  res.render("profile", { user: user, loggedInUser: loggedInUser, followUser:followUser });
});
// chat page

router.get("/chat", isLoggedIn, async function (req, res, next) {
  const user = await userSchema.findOne({ _id: req.user._id });
  const allUser = await userSchema.find({ _id: { $ne: req.user._id } });
  res.render("chat", { user: user, allUser: allUser });
});

// get signup page
router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.get("/posts", isLoggedIn, async function (req, res, next) {
  const user = await userSchema.findOne({ _id: req.user._id });
  const posts = await postSchema.find({}).populate("author");
  const likesPopulate = await postSchema.find({}).populate("likes");
  res.json({ posts: posts, user: user, likesPopulate: likesPopulate });
});

router.get("/like/:id", isLoggedIn, async function (req, res, next) {
  const post = await postSchema.findOne({ _id: req.params.id });
  if (post.likes.indexOf(req.user._id) == -1) {
    post.likes.push(req.user._id);
  } else {
    post.likes.splice(post.likes.indexOf(req.user._id), 1);
  }
  await post.save();
  res.json({ success: true, post: post });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/post/:id", isLoggedIn, async (req, res) => {
  const post = await postSchema
    .findById(req.params.id)
    // .populate("author comments.author");
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    });

  res.json({ post: post, user: req.user });
});
// followers
router.get("/follow/:id", isLoggedIn, async (req, res) => {
  const followUser = await userSchema.findOne({ _id: req.params.id });
  const loggedInUser = await userSchema.findOne({ _id: req.user._id });
  if (followUser.followers.indexOf(loggedInUser)) {
    followUser.followers.splice(
      followUser.followers.indexOf(loggedInUser._id),
      1
    );
    loggedInUser.following.splice(
      loggedInUser.following.indexOf(followUser._id),
      1
    );
  } else {
    followUser.followers.push(loggedInUser._id)
    loggedInUser.following.push(followUser._id)
  }
  await loggedInUser.save()
  await followUser.save()
  res.redirect(req.header("referer"))
});

// deletecomment
router.get("/deletecomment/:postid/:cmtid", isLoggedIn, async (req, res) => {
  const post = await postSchema.findById(req.params.postid);
  var index = post.comments.indexOf(req.params.cmtid);
  post.comments.splice(index, 1);
  await post.save();
  await commentModel.findByIdAndDelete(req.params.cmtid);
  res.redirect(req.header("referer"));
});
// save chats
router.post("/save-chat", async function (req, res, next) {
  var chat = new Chat({
    sender_id: req.body.sender_id,
    receiver_id: req.body.receiver_id,
    message: req.body.message,
  });
  var newChat = await chat.save();
  res.status(200).send({ success: true, msg: "Chat Inserted", data: newChat });
});

// comment
router.post("/comment/:id", isLoggedIn, async (req, res) => {
  const post = await postSchema.findById(req.params.id);
  const { comment } = req.body;
  const cmt = await commentModel.create({
    author: req.user._id,
    comment: comment,
    post: req.params.id,
  });
  post.comments.push(cmt._id);
  await post.save();
  res.redirect(req.header("referer"));
});

// upload profile picture
router.post(
  "/uploadprofile",
  upload.single("profilePhoto"),
  isLoggedIn,
  async (req, res, next) => {
    const user = await userSchema.findOne({ _id: req.user._id });
    user.profile_picture = `../uploads/${req.file.filename}`;
    await user.save();
    res.json({ message: "success upload profile", user: user });
  }
);

// update profile
router.post("/save-edit", isLoggedIn, async function (req, res, next) {
  await userSchema.findByIdAndUpdate(
    { _id: req.user._id },
    {
      fullName: req.body.fullName,
      bio: req.body.bio,
      links: req.body.links,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
    }
  );
  const user = await userSchema.findById(req.user._id);
  // console.log(user);
  res.send({ message: "success", user: user });
});

// upload post
router.post(
  "/uploadpost",
  upload.single("file"),
  isLoggedIn,
  async (req, res, next) => {
    try {
      const post = await postSchema.create({
        author: req.user._id,
        title: req.body.title,
        file: `../uploads/${req?.file?.filename}`,
        filetype: req?.file?.mimetype.split("/")[0],
        date: Date.now(),
      });
      const user = await userSchema.findById(req.user._id);
      user.posts.push(post._id);
      await user.save();
      res.redirect("/");
    } catch (err) {
      res.send(new Error(err));
    }
  }
);

// login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
  function (req, res, next) {}
);

// register
router.post("/register", function (req, res, next) {
  const newUser = new userSchema({
    email: req.body.email,
    number: req.body.number,
    fullName: req.body.fullName,
  });
  userSchema.register(newUser, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/");
    });
  });
});

// check login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
// function checkedLoggedin(req, res, next) {

// }

module.exports = router;

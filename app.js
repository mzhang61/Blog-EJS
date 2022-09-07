//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "homeStartingContent";
const aboutContent = "aboutContent";
const contactContent = "contactContent";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
 title: String,
 content: String
};

//creating posts in the collection. mongoose automatically make "Post" p small letter and add s.
const Post = mongoose.model("Post", postSchema);



app.get("/", function(req,res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      homeStarting: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function(req,res) {
  res.render("about", {
    aboutCont: aboutContent,
  });
});

app.get("/contact", function(req,res) {
  res.render("contact", {
    contactCont:contactContent
  });
});


app.get("/compose", function(req,res) {
  res.render("compose" )
});

app.post("/compose", function(req,res){
  const post = new Post({
    title: req.body.composeText,
    content: req.body.composeTextArea
  });

  post.save(function(err) {
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  //postTitle in route
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});






app.listen(3002, function() {
  console.log("Server started on port 3002");
});

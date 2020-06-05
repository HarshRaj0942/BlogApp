var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(sanitizer());
app.use(methodOverride("_method"));

//server listening at port 6969

app.listen(9000, function () {
  console.log("The BlogApp Server listening at port 9000");
});

//connect to our database
mongoose.connect("mongodb://localhost:27017/BlogApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//each blog has a title, image, content, date

var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  content: String,
  created: { type: Date, default: Date.now },
});
var blogModel = mongoose.model("blog", blogSchema);

//RESTful Routes

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  blogModel.find({}, function (err, blogs) {
    if (err) console.log("Error obtaining blogs!");
    else {
      console.log("Blogs found!!!.......");
      console.log(blogs);
      res.render("index", { blogs: blogs });
    }
  });
});

app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//post route , this must be sanitized though
app.post("/blogs", function (req, res) {
  //create the blog from the req object sent by the new page

  req.body.blog.content = req.sanitize(req.body.blog.content);
  blogModel.create(req.body.blog, function (err, newBlog) {
    if (err) console.log("Error in creating new blog!");
    else {
      res.redirect("/blogs");
    }
  });
});

//show route
app.get("/blogs/:id", function (req, res) {
  blogModel.findById(req.params.id, function (err, foundBlog) {
    if (err) console / log("Blog not found!");
    else {
      res.render("shows", { blog: foundBlog });
    }
  });
});

//edit route

app.get("/blogs/:id/edit", function (req, res) {
  blogModel.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log("Error finding the blog!");
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//update route
app.put("/blogs/:id", function (req, res) {
  req.body.blog.content = req.sanitize(req.body.blog.content);
  blogModel.findByIdAndUpdate(req.params.id, req.body.blog, function (
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      // res.send("updated!");
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//destroy blog route
app.delete("/blogs/:id", function (req, res) {
  blogModel.findByIdAndRemove(req.params.id, function (err) {
    if (err) res.redirect("/blogs");
    else res.redirect("/blogs");
  });
});

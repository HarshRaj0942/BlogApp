var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

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

// blogModel.create(
//   {
//     title: "Barbarossa",
//     image:
//       "https://cdn.britannica.com/s:700x500/01/150101-050-810CE9A9/soldiers-German-part-Soviet-Union-Operation-Barbarossa-1941.jpg",
//     content: "Arguably the greatest battle fought in human history.",
//   },
//   function (err, blog) {
//     if (err) console.log("error!");
//     else console.log("NEW BLOG!!");
//     console.log(blog);
//   }
// );

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

//post route
app.post("/blogs", function (req, res) {
  //create the blog from the req object sent by the new page

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

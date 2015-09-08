var express = require('express'),
	path = require("path"),
    bodyParser = require('body-parser'),
    db = require("./models"),
    app = express(),
    views = path.join(process.cwd(), "views/");

/* CONFIG */
/* serve js & css files */
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));

/* body parser config to accept all datatypes */
app.use(bodyParser.urlencoded({ extended: true }));

/* Hardcoded data for testing */
var tasks = [
  { name: "Walk Miko",
    description: "Miko needs to be walked for 30 minutes daily",
    priority: 2
  },
  {
    name: "Complete GA homework",
    description: "Read the homework",
    priority: 1
  },
  {
    name: "Watch TV",
    description: "Relax and watch television",
    priority: 5
  }
]


/* home page */
app.get("/", function (req, res){
  // render index.html
  res.sendFile(path.join(views, 'home.html'));
});

/* signup page */
app.get("/signup", function(req, res){
  console.log("you requested the signup page");
	res.sendFile(path.join(views, 'signup.html'));
});

/* login page */
app.get("/login", function(req, res){
  console.log("you requested the login page");
	res.sendFile(path.join(views,'login.html'));
});

/* list page */
app.get("/list", function(req, res){
  res.sendFile(path.join(views, 'list.html'));
});


/* Where the user submits the sign up form */
app.post(["/users", "/signup"], function signup(req, res) {
  // grab the user from the params
  console.log("request body: " + req.body);
  var user = req.body.user;
  console.log("user: " + user);

  // pull out their email & password
  var email = user.email;
  console.log("email: " + email);

  var password = user.password;
  console.log("password: " + password);

  // create the new user
  db.User.createSecure(email, password, function(err) {
    if(err)console.log(err);

    console.log("new user created: " + user);
    res.redirect("/home");
  });

});

/* Where the user submits the login form */
app.post(["/sessions", "/login"], function login(req, res) {
  console.log("req: " + req);
  var user = req.body.username;
  console.log("user : " + user);
  var email = user.email;
  console.log("email: " + email);
  var password = user.password;
  console.log("password: " + password);
  db.User.authenticate(email, password, function (err, user) {
    res.send(email + " is logged in\n");
  });
});

/* Post data to the list page */
app.post("/list", function(req, res){
  res.send(tasks);
});

var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});
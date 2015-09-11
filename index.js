var express = require('express'),
	path = require("path"),
    bodyParser = require('body-parser'),
    db = require("./models"),
    session = require('express-session'),
    app = express(),
    views = path.join(process.cwd(), "views/");

/* CONFIG */
/* serve js & css files */
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));

/* body parser config to accept all datatypes */
app.use(bodyParser.urlencoded({ extended: true }));

/* create our session */
app.use(
  session({
    secret: 'super-secret-private-keyyy',
    resave: false,
    saveUnitialized: true
  })
);

/* extending the `req` object to help manage sessions */
app.use(function (req, res, next) {
  // login a user
  req.login = function (user) {
    req.session.userId = user._id;
  };
  // find the current user
  req.currentUser = function (cb) {
    db.User.
      findOne({ _id: req.session.userId },
      function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };
  // logout the current user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  }
  // call the next middleware in the stack
  next(); 
});

////////////////////////////////////////////
///                                     ////
///  Hardcoded data for test purposes   ////
///                                     ////
////////////////////////////////////////////

// var id = 2;

// var tasks = [
//   { name: "Walk Miko",
//     description: "Miko needs to be walked for 30 minutes daily",
//     priority: 2,
//     _id: 0
//   },
//   {
//     name: "Complete GA homework",
//     description: "Read the homework",
//     priority: 1,
//     _id: 1
//   },
//   {
//     name: "Watch TV",
//     description: "Relax and watch television",
//     priority: 5,
//     _id: 2
//   }
// ]

////////////////////////////////////////////
///                                     ////
///     GET request handling            ////
///                                     ////
////////////////////////////////////////////

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

/* logout route */
// app.get("/logout", function(req,res){
//   console.log("you are logging out now");
//   req.session.userId = null;
//   req.user = null;
//   res.redirect("/login");
// });

/* get list page - HTML endpoint */
app.get("/list", function(req, res){
  var sessionId = req.session.userId;
  if(sessionId === undefined || sessionId === null)
  {
    res.redirect("/login");
  }
  else
  {
    res.sendFile(views + '/list.html');
  }
});

/* get list page - API endpoint */
app.get("/list-api", function(req,res){
  db.Task.find({}, function(err,tasks){
    if(err)
    {
      console.log(err);
    }

    res.send(tasks);
  });
});

/* get task modify page - HTML endpoint */
app.get("/modify-task", function(req, res){
  res.sendFile(path.join(views, 'modify-task.html'));
});

////////////////////////////////////////////
///                                     ////
///     POST request handling           ////
///                                     ////
////////////////////////////////////////////

/* where the user submits the SIGN UP form */
app.post(["/users", "/signup"], function signup(req, res) {

  // grab the user from the params
  var user = req.body.user;
  console.log("user:", user);

  // pull out their email & password
  var email = user.email;
  var password = user.password;

  // console.log("email:", email);
  // console.log("password:", password);

  // create the new user
  db.User.createSecure(email, password, function(err, user) {
    console.log(email + " is registered!\n");
    req.login(user);
    res.redirect("/list");
  });

});

/* where the user submits the LOGIN form */
app.post(["/sessions", "/login"], function login(req, res) {
  var user = req.body.user;
  var email = user.email;
  var password = user.password;
  db.User.authenticate(email, password, function (err, user) {
    if(err)
    {
      console.log(err);
      res.send(err);
    }
    else //don't login the user unless the password is correct!
    {
      // login the user
      req.login(user);
      console.log("session id after login:", req.session.userId);
      // redirect to user profile
      res.redirect("/list"); 
    }
    
  });
});

/* post data to the LIST page */
app.post("/list", function(req, res){
  
  taskName = req.body.task_name;
  taskDescription = req.body.task_description;
  taskPriority = req.body.task_priority;

  var newTask = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
  }

  //tasks.push(newTask);
  db.Task.create(newTask, function(err, task){
    if(err)console.log(err);
    console.log("new task created: " + task);
    res.sendStatus(200);
  });  
});

/* logout */
app.post("/logout", function(req, res){
  console.log("you are logging out now");
  req.session.userId = null;
  req.user = null;
  console.log('sanity');
  res.redirect("/login");
  //res.sendStatus(200);
});

////////////////////////////////////////////
///                                     ////
///     DELETE request handling         ////
///                                     ////
////////////////////////////////////////////

/* delete a task from the list */
app.delete("/list/:id", function(req, res){
  var targetId = req.params.id;
  console.log(targetId);
  //tasks.splice(targetId,1);
  //console.log(tasks);
  //res.send(task);

  db.Task.remove({_id: targetId}, function(err, task){
    if(err)console.log(err);
    //console.log("removal of", task, "successful");
    db.Task.find({}, function(err, tasks){
      if(err) {
        res.sendStatus(200);
      } else {
        console.log("tasks found:", tasks);
        res.sendStatus(200);
      }
    
    })

    
  });
});

////////////////////////////////////////////
///                                     ////
///     PUT request handling            ////
///                                     ////
////////////////////////////////////////////

/* Updating tasks on the list */
app.put("/modify-task/:id", function(req, res){
  var taskId = req.params.id;
  console.log("task id to modify:", taskId);

  //console.log("request body:", req.body);
  var updatedName = req.body.updated_name;
  var updatedDescription = req.body.updated_description;
  var updatedPriority = req.body.updated_priority;

  console.log("updated name:", updatedName);
  console.log("updated description:", updatedDescription);
  console.log("updated priority:", updatedPriority);

  var updatedTask = {
    name: updatedName,
    description: updatedDescription,
    priority: updatedPriority
  }

  db.Task.update({ _id: taskId}, updatedTask, {}, function(err, success) {
      if(err){ return console.log(err);}
      console.log("new task:", success);
      res.send(success);
  });

});



// var listener = app.listen(3000, function () {
//   console.log("Listening on port " + listener.address().port);
// });

app.listen(process.env.PORT || 3000)
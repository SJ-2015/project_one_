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

/* get list page - HTML endpoint */
app.get("/list", function(req, res){
  res.sendFile(path.join(views, 'list.html'));
});

/* get list page - API endpoint */
app.get("/list-api", function(req,res){
  db.Task.find({}, function(err,tasks){
    if(err)
    {
      res.sendStatus(200);
    }
    // if(tasks.length === 0)
    // {
    //   res.send("No more tasks");
    // }

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

    //console.log("new user created: " + user);
    res.redirect("/home");
  });

});

/* where the user submits the LOGIN form */
app.post(["/sessions", "/login"], function login(req, res) {
  //console.log("req: " + req);
  var user = req.body.username;
  //console.log("user : " + user);
  var email = user.email;
  //console.log("email: " + email);
  var password = user.password;
  console.log("password: " + password);
  db.User.authenticate(email, password, function (err, user) {
    res.send(email + " is logged in\n");
  });
});

/* post data to the LIST page */
app.post("/list", function(req, res){
  //id++;
  //console.log("post request received!");

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


////////////////////////////////////////////
///                                     ////
///     DELETE request handling         ////
///                                     ////
////////////////////////////////////////////

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

app.put("/modify-task/:id", function(req, res){

});



var listener = app.listen(3000, function () {
  console.log("Listening on port " + listener.address().port);
});
var db = require('./models');

// db.User.remove({}, function(err){
// 	if(err)console.log(err);
// 	console.log("removed all users successfully!");
// });

// db.User.createSecure("alice@ga.co", "foobarbazz", function(err, user){
//   console.log("success!", user);
// });

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

db.Task.remove({}, function(err){
	if(err)console.log(err);
	console.log("removed all users successfully!");
});

db.Task.create(tasks, function(err, tasks){
	if(err)console.log(err);
	console.log("created", tasks.length, "tasks");
	console.log(tasks);
	process.exit();
});
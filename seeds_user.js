var db = require('./models');

/* seed for the user model */
db.User.remove({}, function(err){
	if(err)console.log(err);
	console.log("removed all users successfully!");
});

db.User.createSecure("alice@ga.co", "foobarbazz", function(err, user){
  console.log("success!", user);
  db.User.find({}, function(err, users){
	if(err)console.log(err);
	console.log("users:", users);
	});
});


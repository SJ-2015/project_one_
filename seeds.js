var db = require('./models');

db.User.remove({}, function(err){
	if(err)console.log(err);
	console.log("removed all users successfully!");
});

db.User.createSecure("alice@ga.co", "foobarbazz", function(err, user){
  console.log("success!", user);
});

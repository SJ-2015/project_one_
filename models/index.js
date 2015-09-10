var mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/_project_one__");
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      "mongodb://localhost/_project_one__" )

module.exports.User = require("./user");
module.exports.Task = require("./task");


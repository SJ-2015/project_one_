var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/_project_one__");
module.exports.User = require("./user");
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: String,
	description: String,
	priority: Number
});

var Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
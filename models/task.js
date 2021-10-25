// require dependencies
const mongoose = require('mongoose');
// set up shortcut variable
const Schema = mongoose.Schema;
// create the schema
const taskSchema = new Schema({
    priority: String,
    matter: String,
    task: String,
    notes: String,
    deadline: String,
    completed: Boolean
     
}, { timestamps: true });
// compile the schema into a model

// export the model so we can access it somewhere else
const Task = mongoose.model("Task", taskSchema)

module.exports = Task

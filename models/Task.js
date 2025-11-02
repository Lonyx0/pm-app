const mongoose = require('mongoose');

const TaskSchema =  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
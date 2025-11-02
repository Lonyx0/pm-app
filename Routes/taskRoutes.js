const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const projectRoleCheck = require("../middleware/projectRoleCheck");
const Task = require("../models/Task");
const Project = require("../models/Project");

//create a new task in a project (only project admin)
router.post('/create', auth, projectRoleCheck("admin"), async (req, res) => {
    try {
        const { title, description, projectId, assignedTo } = req.body;
        //projectId doğrulaması middleware tarafından yapıldı
        const task = new Task({
            title,
            description,
            project: projectId,
            assignedTo
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//get tasks for a project (only project members)
router.get('/by-project/:id', auth, projectRoleCheck(), async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id }).populate("assignedTo", "username email");
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//update task
router.patch('/:id/update', auth, async (req,res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Task not found' });

        const project = await Project.findById(task.project);
        const member = project.members.find(m => m.user.toString() === req.user.id);
        if(!member) return res.status(403).json({ message: 'Not a project member' });

        // izin ver => güncelle
        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
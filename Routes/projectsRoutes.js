const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const projectRoleCheck = require("../middleware/projectRoleCheck");
const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project (only authenticated users => Admin)
router.post('/create', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = new Project({
            name,
            description,
            admin: req.user.id,
            members: [ { user: req.user.id, role: "admin" }]
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a member to a project (only Admins)
router.post('/:id/add-member', auth, projectRoleCheck("admin"), async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: 'User not found' });

        const project = req.project;

        // Check if user is already a member
        if(project.members.some(m => m.user.toString() === user._id.toString())) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        project.members.push({ user: user._id, role: "member" });
        await project.save();
        res.json({ message: 'Member added successfully', project})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get projects for the authenticated user
router.get('/my-projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ "members.user": req.user.id }).populate("members.user", "username email");
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
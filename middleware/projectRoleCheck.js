const Project = require('../models/Project');

module.exports = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.id || req.body.projectId;
            if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const member = project.members.find(m => m.user.toString() === req.user.id);
            if (!member) return res.status(403).json({ message: 'Not a project member' });

            if(requiredRole === "admin" && member.role !== "admin") {
                return res.status(403).json({ message: 'Admin role required' });
            }

            req.project = project;
            req.projectMember = member;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};
import express from 'express';
import Project from '../models/Project.js';
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('members.memberId');
    res.json(projects);
  } catch (err) {
    console.error('Error in GET /projects:', err);
    res.status(500).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign member to project
router.put('/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId, task } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Add member assignment
    project.members.push({ memberId, task });
    await project.save();

    const populatedProject = await Project.findById(id).populate('members.memberId');
    res.json(populatedProject);
  } catch (err) {
    console.error('Error assigning member:', err);
    res.status(500).json({ error: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { title, status, teamId } = req.body;
    const project = new Project({ title, status, teamId });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
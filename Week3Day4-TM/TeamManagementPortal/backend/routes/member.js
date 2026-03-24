// backend/routes/members.js
import express from 'express';
import Member from '../models/Member.js';

const router = express.Router();

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new member
router.post('/', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and Email required' });

    const newMember = new Member({ name, role, email });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
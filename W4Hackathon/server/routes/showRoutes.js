// backend/routes/showRoutes.js
const express = require('express');
const router = express.Router();
const Show = require('../models/shows'); // Ensure your model path is correct

// @desc    Get all shows (for Browse page)
// @route   GET /api/shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find().sort({ createdAt: -1 });
    res.status(200).json(shows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching shows", error: err.message });
  }
});

// @desc    Get a single show by ID (for MovieView/Player)
// @route   GET /api/shows/:id
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
    res.status(200).json(show);
  } catch (err) {
    res.status(500).json({ message: "Invalid Show ID", error: err.message });
  }
});

// @desc    Create a new show (for Admin Portal)
// @route   POST /api/shows
// NOTE: Use this endpoint in AddShow.tsx (http://localhost:5000/api/shows)
router.post('/', async (req, res) => {
  try {
    const newShow = new Show(req.body);
    const savedShow = await newShow.save();
    res.status(201).json(savedShow);
  } catch (err) {
    res.status(400).json({ message: "Error creating show", error: err.message });
  }
});

// @desc    Delete a show (for ManageShows page)
// @route   DELETE /api/shows/:id
router.delete('/:id', async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting show", error: err.message });
  }
});

// @desc    Update show details
// @route   PUT /api/shows/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedShow);
  } catch (err) {
    res.status(500).json({ message: "Error updating show", error: err.message });
  }
});

module.exports = router;
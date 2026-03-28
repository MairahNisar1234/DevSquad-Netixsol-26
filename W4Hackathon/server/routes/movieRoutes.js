const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie.js');

router.post('/add', async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.status(201).json({ message: "Movie added!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/', async (req, res) => {
  try {
    const allMovies = await Movie.find(); 
    res.status(200).json(allMovies);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching movies" });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/:id/reviews', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    const newReview = {
      name: req.body.name || "Mairah Nisar", // Using your name for testing
      rating: req.body.rating,
      text: req.body.text
    };

    movie.reviews.push(newReview);
    await movie.save();
    res.status(201).json(movie.reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
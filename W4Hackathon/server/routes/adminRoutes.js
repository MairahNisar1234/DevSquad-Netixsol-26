const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const User = require('../models/Users');

// GET: http://localhost:5000/api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [movieCount, userCount, blockedCount, latestMovies] = await Promise.all([
      Movie.countDocuments(),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ status: 'blocked' }),
      Movie.find().sort({ createdAt: -1 }).limit(5) // Gets the 5 newest movies
    ]);

    res.json({
      totalMovies: movieCount,
      totalUsers: userCount,
      blockedUsers: blockedCount,
      recentActivity: latestMovies.map(m => ({
        id: m._id,
        text: `New content added: ${m.title}`,
        time: m.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
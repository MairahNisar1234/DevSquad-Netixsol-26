const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  videoUrl: String,
  releaseYear: String,
  rating: Number,
  cast: [{
    name: { type: String, required: true },
    image: { type: String, required: true }
  }],
  
  director: {
    name: String,
    image: String
  },
  reviews: [{
    name: { type: String, default: "Anonymous User" },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  genres: [String]
});
module.exports = mongoose.model('Movie', movieSchema);
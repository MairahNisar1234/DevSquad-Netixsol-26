const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String, // URL or file path to the cover image
    required: true
  },
  genre: {
    type: [String], // e.g., ["Action", "Drama"]
    default: []
  },
  releaseDate: {
    type: Date,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  seasons: {
    type: Number, // Displayed in your UI as "5 Seasons"
    default: 1
  },
  cast: [
    {
      name: String,
      role: String,
      image: String
    }
  ],
  rating: {
    imdb: { type: Number, default: 0 },
    streamvibe: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Show', ShowSchema);
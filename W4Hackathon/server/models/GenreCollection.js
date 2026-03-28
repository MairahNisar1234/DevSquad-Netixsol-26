// models/GenreCollection.js (New Model in backend)
const genreCollectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Action"
  isTop10: { type: Boolean, default: false }, // To separate the first two rows
  collagePosters: [{ type: String }], // Array of exactly 4 poster URLs
});

module.exports = mongoose.model('GenreCollection', genreCollectionSchema);
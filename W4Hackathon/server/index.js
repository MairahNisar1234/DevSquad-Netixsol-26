const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const movieRoutes = require('./routes/movieRoutes'); 
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const showRoutes = require('./routes/showRoutes');

dotenv.config();

const app = express();

// --- MODIFIED CORS ---
// Replace with your actual Vercel frontend URL once deployed
app.use(cors({
  origin: "*", // Allows any website to access your backend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Database Connection
const dbURI = process.env.MONGODB_URI;
if (dbURI) {
  mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
}
// --- ROUTES ---
app.use('/api/users', authRoutes); 
app.use('/api/movies', movieRoutes); 
app.use('/api/shows', showRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("StreamVibe Server is running! 🚀");
});

// --- VERCEL REQUIREMENT: EXPORT THE APP ---
module.exports = app; 

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`📡 Server listening on port ${PORT}`);
  });
}
// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import projectRoutes from './routes/projects.js'; // make sure routes also use ESM
import memberRoutes from './routes/member.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';

// Allow JSON requests
app.use(express.json());

// Enable CORS for your frontend URL
app.use(cors({
  origin: 'http://localhost:5174', // your frontend URL
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);       // <--- important
app.use('/projects', projectRoutes);
app.use('/members', memberRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teamportal';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./db.js"; 

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

await connectDB(); 
// --- CORS CONFIGURATION ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://dbfrontend.vercel.app" // your frontend
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// --- EXPORT APP FOR VERCEL ---
export default app;
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import authRoutes from "../src/routes/authRoutes.js";
import taskRoutes from "../src/routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API running 🚀" });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}

// local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
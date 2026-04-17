import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { allowRoles } from "../middleware/role.js";


import auth from "../middleware/auth.js";

const router = express.Router();

// PUBLIC REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user" // normal user by default
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



//login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//register admin and super-admin

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["admin","superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: `${role} created successfully` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// In userRoutes.js
router.patch("/:id/status", auth, allowRoles("admin"), async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isBlocked }, 
      { new: true }
    );
    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
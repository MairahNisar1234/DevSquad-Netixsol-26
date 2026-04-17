import express from "express";
import User from "../models/User.js";
import { auth, allowRoles } from "../middleware/auth.js";

const router = express.Router();

// 1. GET all users for the Admin Dashboard
router.get("/", auth, allowRoles("admin", "superadmin"), async (req, res) => {
  try {
    // Select all fields except password
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. PATCH (Update) user status
router.patch("/:id/status", auth, allowRoles("admin", "superadmin"), async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isBlocked }, 
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
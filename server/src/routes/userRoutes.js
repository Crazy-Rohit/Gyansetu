// server/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { authRequired } = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users/me - get current logged-in user's profile
router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash")
      .populate("classLevel"); // remove if unused

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET /users/me error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/me - update current logged-in user's profile
router.put("/me", authRequired, async (req, res) => {
  try {
    const allowed = ["name", "phone", "classLevel", "address", "institution"];
    const updates = {};

    // Only update fields user sends
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select("-passwordHash")
      .populate("classLevel");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("PUT /users/me error", err);

    if (err.code === 11000) {
      const duplicate = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `${duplicate} already in use`,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const ClassLevel = require('../models/ClassLevel');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      institution,
      role,
      classCode, // "9" or "10" from frontend for students
      password,
    } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    // check if user exists (by email or phone)
    const existing = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with this email/phone' });
    }

    let classLevelId = null;
    if (role === 'student' && classCode) {
      const classLevel = await ClassLevel.findOne({ code: classCode });
      if (!classLevel) {
        return res.status(400).json({ message: 'Invalid class code' });
      }
      classLevelId = classLevel._id;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      institution,
      role: role || 'student',
      classLevel: classLevelId,
      passwordHash,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      classLevel: user.classLevel,
    };

    res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or phone

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password required' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      classLevel: user.classLevel,
    };

    res.json({ user: userSafe, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

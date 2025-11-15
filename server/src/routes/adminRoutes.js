const User = require('../models/User');

const express = require('express');
const { authRequired, requireRole } = require('../middleware/auth');

const ClassLevel = require('../models/ClassLevel');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const ContentItem = require('../models/ContentItem');

const router = express.Router();

// All routes here require admin
router.use(authRequired, requireRole('admin'));

/* ---- CLASSES ---- */

// POST /api/admin/classes
router.post('/classes', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const cls = await ClassLevel.create({ name, code, description });
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await ClassLevel.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---- SUBJECTS ---- */

// POST /api/admin/subjects
router.post('/subjects', async (req, res) => {
  try {
    const { classLevelId, name, code, description } = req.body;
    const subject = await Subject.create({
      classLevel: classLevelId,
      name,
      code,
      description,
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/subjects/:classLevelId
router.get('/subjects/:classLevelId', async (req, res) => {
  try {
    const subjects = await Subject.find({ classLevel: req.params.classLevelId });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---- CHAPTERS ---- */

// POST /api/admin/chapters
router.post('/chapters', async (req, res) => {
  try {
    const { subjectId, title, chapterNumber, description } = req.body;
    const chapter = await Chapter.create({
      subject: subjectId,
      title,
      chapterNumber,
      description,
    });
    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/chapters/:subjectId
router.get('/chapters/:subjectId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject: req.params.subjectId }).sort({
      chapterNumber: 1,
    });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---- CONTENT ITEMS ---- */

// POST /api/admin/content
router.post('/content', async (req, res) => {
  try {
    const {
      chapterId,
      type,
      title,
      description,
      order,
      thumbnailUrl,
      youtubeUrl,
      fileUrl,
      externalUrl,
      durationMinutes,
      pagesCount,
      maxMarks,
    } = req.body;

    const content = await ContentItem.create({
      chapter: chapterId,
      type,
      title,
      description,
      order,
      thumbnailUrl,
      youtubeUrl,
      fileUrl,
      externalUrl,
      durationMinutes,
      pagesCount,
      maxMarks,
      createdBy: req.user._id,
    });

    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/content/:chapterId
router.get('/content/:chapterId', async (req, res) => {
  try {
    const items = await ContentItem.find({ chapter: req.params.chapterId }).sort({
      type: 1,
      order: 1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


/* ---- USERS (optional) ---- */

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;

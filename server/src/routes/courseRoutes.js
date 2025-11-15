const express = require('express');
const ClassLevel = require('../models/ClassLevel');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const ContentItem = require('../models/ContentItem');

const router = express.Router();

// GET /api/courses/classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await ClassLevel.find({ isActive: true });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/:classId/subjects
router.get('/:classId/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({
      classLevel: req.params.classId,
      isActive: true,
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/subject/:subjectId/chapters
router.get('/subject/:subjectId/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find({
      subject: req.params.subjectId,
      isActive: true,
    }).sort({ chapterNumber: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/chapter/:chapterId/content
router.get('/chapter/:chapterId/content', async (req, res) => {
  try {
    const contents = await ContentItem.find({
      chapter: req.params.chapterId,
    }).sort({ type: 1, order: 1 });

    // optional: group by type for convenience
    const grouped = {
      lectures: contents.filter((c) => c.type === 'lecture'),
      notes: contents.filter((c) => c.type === 'note'),
      tests: contents.filter((c) => c.type === 'test'),
      books: contents.filter((c) => c.type === 'book'),
    };

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

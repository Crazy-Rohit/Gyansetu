// server/src/routes/courseRoutes.js
const express = require("express");
const ClassLevel = require("../models/ClassLevel");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const ContentItem = require("../models/ContentItem");

const router = express.Router();

/**
 * PUBLIC COURSE ROUTES
 * These are used by the frontend "courseApi.js" and "CourseContentPage".
 *
 * Base path from server.js: /api/courses
 *
 *  GET /api/courses/classes              -> list of classes
 *  GET /api/courses/subjects/:classId   -> subjects for a class
 *  GET /api/courses/chapters/:subjectId -> chapters for a subject
 *  GET /api/courses/content/:chapterId  -> content grouped by type
 */

// GET /api/courses/classes
router.get("/classes", async (req, res) => {
  try {
    const classes = await ClassLevel.find({ isActive: { $ne: false } }).sort({
      createdAt: 1,
    });

    res.json(classes);
  } catch (err) {
    console.error("GET /courses/classes error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/courses/subjects/:classLevelId
router.get("/subjects/:classLevelId", async (req, res) => {
  try {
    const classLevelId = req.params.classLevelId;

    const subjects = await Subject.find({
      classLevel: classLevelId,
      isActive: { $ne: false },
    }).sort({ createdAt: 1 });

    res.json(subjects);
  } catch (err) {
    console.error("GET /courses/subjects/:classLevelId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/courses/chapters/:subjectId
router.get("/chapters/:subjectId", async (req, res) => {
  try {
    const subjectId = req.params.subjectId;

    const chapters = await Chapter.find({
      subject: subjectId,
      isActive: { $ne: false },
    }).sort({ chapterNumber: 1, createdAt: 1 });

    res.json(chapters);
  } catch (err) {
    console.error("GET /courses/chapters/:subjectId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/courses/content/:chapterId
// Returns content grouped by type so the frontend can show
// lectures / notes / tests / books separately.
router.get("/content/:chapterId", async (req, res) => {
  try {
    const chapterId = req.params.chapterId;

    const items = await ContentItem.find({
      chapter: chapterId,
    }).sort({ createdAt: -1 });

    const groupByType = (type) =>
      items.filter((item) => item.type === type && item.isActive !== false);

    res.json({
      lectures: groupByType("lecture"),
      notes: groupByType("note"),
      tests: groupByType("test"),
      books: groupByType("book"),
    });
  } catch (err) {
    console.error("GET /courses/content/:chapterId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

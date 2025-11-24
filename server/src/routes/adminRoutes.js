// server/src/routes/adminRoutes.js
const express = require("express");
const { authRequired, requireRole } = require("../middleware/auth");

const ClassLevel = require("../models/ClassLevel");
const Subject = require("../models/Subject");
const Chapter = require("../models/Chapter");
const ContentItem = require("../models/ContentItem");
const User = require("../models/User");

const router = express.Router();

// All admin routes require admin role
router.use(authRequired, requireRole("admin"));

/* ======================
 *        CLASSES
 * ====================== */

// GET /api/admin/classes
router.get("/classes", async (req, res) => {
  try {
    const classes = await ClassLevel.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    console.error("GET /admin/classes error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/classes
router.post("/classes", async (req, res) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required" });
    }

    const exists = await ClassLevel.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const cls = await ClassLevel.create({
      name,
      code,
      description: description || "",
    });

    res.status(201).json(cls);
  } catch (err) {
    console.error("POST /admin/classes error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/classes/:id
router.put("/classes/:id", async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    const cls = await ClassLevel.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(cls);
  } catch (err) {
    console.error("PUT /admin/classes/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/classes/:id
// Cascades to subjects, chapters and content items
router.delete("/classes/:id", async (req, res) => {
  try {
    const classId = req.params.id;

    const subjects = await Subject.find({ classLevel: classId }).select("_id");
    const subjectIds = subjects.map((s) => s._id);

    const chapters = await Chapter.find({ subject: { $in: subjectIds } }).select(
      "_id"
    );
    const chapterIds = chapters.map((c) => c._id);

    await ContentItem.deleteMany({ chapter: { $in: chapterIds } });
    await Chapter.deleteMany({ subject: { $in: subjectIds } });
    await Subject.deleteMany({ classLevel: classId });
    await ClassLevel.findByIdAndDelete(classId);

    res.json({ message: "Class and related data deleted" });
  } catch (err) {
    console.error("DELETE /admin/classes/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
 *        SUBJECTS
 * ====================== */

// GET /api/admin/subjects/:classLevelId
router.get("/subjects/:classLevelId", async (req, res) => {
  try {
    const subjects = await Subject.find({
      classLevel: req.params.classLevelId,
    }).sort({ createdAt: 1 });
    res.json(subjects);
  } catch (err) {
    console.error("GET /admin/subjects/:classLevelId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/subjects
router.post("/subjects", async (req, res) => {
  try {
    const { classLevelId, name, code, description } = req.body;
    if (!classLevelId || !name || !code) {
      return res
        .status(400)
        .json({ message: "classLevelId, name and code are required" });
    }

    const subject = await Subject.create({
      classLevel: classLevelId,
      name,
      code,
      description: description || "",
    });

    res.status(201).json(subject);
  } catch (err) {
    console.error("POST /admin/subjects error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/subjects/:id
router.put("/subjects/:id", async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(code !== undefined && { code }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (err) {
    console.error("PUT /admin/subjects/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/subjects/:id
// Cascades to chapters and content items
router.delete("/subjects/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;

    const chapters = await Chapter.find({ subject: subjectId }).select("_id");
    const chapterIds = chapters.map((c) => c._id);

    await ContentItem.deleteMany({ chapter: { $in: chapterIds } });
    await Chapter.deleteMany({ subject: subjectId });
    await Subject.findByIdAndDelete(subjectId);

    res.json({ message: "Subject and related data deleted" });
  } catch (err) {
    console.error("DELETE /admin/subjects/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
 *        CHAPTERS
 * ====================== */

// GET /api/admin/chapters/:subjectId
router.get("/chapters/:subjectId", async (req, res) => {
  try {
    const chapters = await Chapter.find({
      subject: req.params.subjectId,
    }).sort({ chapterNumber: 1, createdAt: 1 });
    res.json(chapters);
  } catch (err) {
    console.error("GET /admin/chapters/:subjectId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/chapters
router.post("/chapters", async (req, res) => {
  try {
    const { subjectId, title, chapterNumber, description } = req.body;
    if (!subjectId || !title) {
      return res
        .status(400)
        .json({ message: "subjectId and title are required" });
    }

    const chapter = await Chapter.create({
      subject: subjectId,
      title,
      chapterNumber: chapterNumber ?? null,
      description: description || "",
    });

    res.status(201).json(chapter);
  } catch (err) {
    console.error("POST /admin/chapters error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/chapters/:id
router.put("/chapters/:id", async (req, res) => {
  try {
    const { title, chapterNumber, description, isActive } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(chapterNumber !== undefined && { chapterNumber }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.json(chapter);
  } catch (err) {
    console.error("PUT /admin/chapters/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/chapters/:id
router.delete("/chapters/:id", async (req, res) => {
  try {
    const chapterId = req.params.id;

    await ContentItem.deleteMany({ chapter: chapterId });
    await Chapter.findByIdAndDelete(chapterId);

    res.json({ message: "Chapter and related content deleted" });
  } catch (err) {
    console.error("DELETE /admin/chapters/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
 *        CONTENT
 * ====================== */

// GET /api/admin/content/:chapterId
router.get("/content/:chapterId", async (req, res) => {
  try {
    const items = await ContentItem.find({
      chapter: req.params.chapterId,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error("GET /admin/content/:chapterId error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/content
router.post("/content", async (req, res) => {
  try {
    const {
      chapterId,
      type,
      title,
      description,
      youtubeUrl,
      fileUrl,
      externalUrl,
      durationMinutes,
      pagesCount,
      maxMarks,
    } = req.body;

    if (!chapterId || !type || !title) {
      return res
        .status(400)
        .json({ message: "chapterId, type and title are required" });
    }

    const item = await ContentItem.create({
      chapter: chapterId,
      type,
      title,
      description: description || "",
      youtubeUrl: youtubeUrl || "",
      fileUrl: fileUrl || "",
      externalUrl: externalUrl || "",
      durationMinutes: durationMinutes ?? null,
      pagesCount: pagesCount ?? null,
      maxMarks: maxMarks ?? null,
      createdBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("POST /admin/content error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/content/:id
router.put("/content/:id", async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      youtubeUrl,
      fileUrl,
      externalUrl,
      durationMinutes,
      pagesCount,
      maxMarks,
    } = req.body;

    const item = await ContentItem.findByIdAndUpdate(
      req.params.id,
      {
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(externalUrl !== undefined && { externalUrl }),
        ...(durationMinutes !== undefined && { durationMinutes }),
        ...(pagesCount !== undefined && { pagesCount }),
        ...(maxMarks !== undefined && { maxMarks }),
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Content item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("PUT /admin/content/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/content/:id
router.delete("/content/:id", async (req, res) => {
  try {
    await ContentItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Content item deleted" });
  } catch (err) {
    console.error("DELETE /admin/content/:id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
 *        USERS
 * ====================== */

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    console.error("GET /admin/users error", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  fetchSubjectsByClass,
  fetchChaptersBySubject,
  fetchContentByChapter,
  createContentItem,
} from "../../api/adminApi";

export default function AdminContent() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [contentItems, setContentItems] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

  const [form, setForm] = useState({
    type: "lecture",
    title: "",
    description: "",
    order: "",
    thumbnailUrl: "",
    youtubeUrl: "",
    fileUrl: "",
    externalUrl: "",
    durationMinutes: "",
    pagesCount: "",
    maxMarks: "",
  });

  const [error, setError] = useState("");

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load classes.");
    }
  };

  const loadSubjects = async (classId) => {
    if (!classId) return;
    try {
      const data = await fetchSubjectsByClass(classId);
      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects.");
    }
  };

  const loadChapters = async (subjectId) => {
    if (!subjectId) return;
    try {
      const data = await fetchChaptersBySubject(subjectId);
      setChapters(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chapters.");
    }
  };

  const loadContent = async (chapterId) => {
    if (!chapterId) return;
    try {
      const data = await fetchContentByChapter(chapterId);
      setContentItems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load content items.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setSubjects([]);
      setSelectedSubject("");
      setChapters([]);
      setSelectedChapter("");
      setContentItems([]);
      loadSubjects(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSubject) {
      setChapters([]);
      setSelectedChapter("");
      setContentItems([]);
      loadChapters(selectedSubject);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedChapter) {
      loadContent(selectedChapter);
    }
  }, [selectedChapter]);

  const handleChangeForm = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedChapter || !form.type || !form.title) {
      setError("Chapter, type and title are required.");
      return;
    }

    const payload = {
      chapterId: selectedChapter,
      type: form.type,
      title: form.title,
      description: form.description,
      order: form.order ? Number(form.order) : undefined,
      thumbnailUrl: form.thumbnailUrl,
      youtubeUrl: form.youtubeUrl,
      fileUrl: form.fileUrl,
      externalUrl: form.externalUrl,
      durationMinutes: form.durationMinutes
        ? Number(form.durationMinutes)
        : undefined,
      pagesCount: form.pagesCount ? Number(form.pagesCount) : undefined,
      maxMarks: form.maxMarks ? Number(form.maxMarks) : undefined,
    };

    try {
      await createContentItem(payload);
      setForm({
        ...form,
        title: "",
        description: "",
        order: "",
        thumbnailUrl: "",
        youtubeUrl: "",
        fileUrl: "",
        externalUrl: "",
        durationMinutes: "",
        pagesCount: "",
        maxMarks: "",
      });
      loadContent(selectedChapter);
    } catch (err) {
      console.error(err);
      setError("Failed to create content item.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Content</h1>
      <p className="admin-page-subtitle">
        Add Lectures (YouTube), Notes (PDF), Tests, and Books for each chapter.
      </p>

      <div className="admin-card">
        <div className="admin-inline">
          <div className="admin-form-row">
            <label>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">-- Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-row">
            <label>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Subject --</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-row">
            <label>Chapter</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">-- Chapter --</option>
              {chapters.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.chapterNumber ? `${ch.chapterNumber}. ` : ""}
                  {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <h3>Add Content Item</h3>
        <form onSubmit={handleSubmit}>
          <div className="admin-inline">
            <div className="admin-form-row">
              <label>Type</label>
              <select
                value={form.type}
                onChange={handleChangeForm("type")}
              >
                <option value="lecture">Lecture</option>
                <option value="note">Note</option>
                <option value="test">Test</option>
                <option value="book">Book</option>
              </select>
            </div>
            <div className="admin-form-row">
              <label>Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={handleChangeForm("order")}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <label>Title</label>
            <input
              type="text"
              placeholder="Intro to Number Systems"
              value={form.title}
              onChange={handleChangeForm("title")}
            />
          </div>

          <div className="admin-form-row">
            <label>Description</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={handleChangeForm("description")}
            />
          </div>

          {/* Link-related fields */}
          <div className="admin-inline">
            <div className="admin-form-row">
              <label>Thumbnail URL (for lecture cards)</label>
              <input
                type="text"
                placeholder="https://..."
                value={form.thumbnailUrl}
                onChange={handleChangeForm("thumbnailUrl")}
              />
            </div>
            <div className="admin-form-row">
              <label>YouTube URL (for lectures)</label>
              <input
                type="text"
                placeholder="https://youtu.be/..."
                value={form.youtubeUrl}
                onChange={handleChangeForm("youtubeUrl")}
              />
            </div>
          </div>

          <div className="admin-inline">
            <div className="admin-form-row">
              <label>File URL (Notes/Tests/Books PDF)</label>
              <input
                type="text"
                placeholder="https://.../file.pdf"
                value={form.fileUrl}
                onChange={handleChangeForm("fileUrl")}
              />
            </div>
            <div className="admin-form-row">
              <label>External URL</label>
              <input
                type="text"
                placeholder="External link e.g. Google Form"
                value={form.externalUrl}
                onChange={handleChangeForm("externalUrl")}
              />
            </div>
          </div>

          <div className="admin-inline">
            <div className="admin-form-row">
              <label>Duration (min) – Lectures</label>
              <input
                type="number"
                value={form.durationMinutes}
                onChange={handleChangeForm("durationMinutes")}
              />
            </div>
            <div className="admin-form-row">
              <label>Pages – Notes/Books</label>
              <input
                type="number"
                value={form.pagesCount}
                onChange={handleChangeForm("pagesCount")}
              />
            </div>
            <div className="admin-form-row">
              <label>Max Marks – Tests</label>
              <input
                type="number"
                value={form.maxMarks}
                onChange={handleChangeForm("maxMarks")}
              />
            </div>
          </div>

          <button type="submit" className="gs-btn">
            Save Content Item
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>Content Items for Selected Chapter</h3>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((c) => (
                <tr key={c._id}>
                  <td>{c.type}</td>
                  <td>{c.title}</td>
                  <td>{c.order || "-"}</td>
                </tr>
              ))}
              {contentItems.length === 0 && (
                <tr>
                  <td colSpan="3">No content added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

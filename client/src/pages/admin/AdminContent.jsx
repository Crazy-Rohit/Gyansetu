import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  fetchSubjectsByClass,
  fetchChaptersBySubject,
  fetchContentByChapter,
  createContentItem,
  updateContentItem,
  deleteContentItem,
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
    youtubeUrl: "",
    fileUrl: "",
    externalUrl: "",
    durationMinutes: "",
    pagesCount: "",
    maxMarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
      if (data.length > 0 && !selectedClass) {
        setSelectedClass(data[0]._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load classes.");
    }
  };

  const loadSubjects = async (classId) => {
    if (!classId) {
      setSubjects([]);
      setSelectedSubject("");
      return;
    }
    try {
      const data = await fetchSubjectsByClass(classId);
      setSubjects(data);
      if (data.length > 0 && !selectedSubject) {
        setSelectedSubject(data[0]._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects.");
    }
  };

  const loadChapters = async (subjectId) => {
    if (!subjectId) {
      setChapters([]);
      setSelectedChapter("");
      return;
    }
    try {
      const data = await fetchChaptersBySubject(subjectId);
      setChapters(data);
      if (data.length > 0 && !selectedChapter) {
        setSelectedChapter(data[0]._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chapters.");
    }
  };

  const loadContent = async (chapterId) => {
    if (!chapterId) {
      setContentItems([]);
      return;
    }
    try {
      const data = await fetchContentByChapter(chapterId);
      setContentItems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load content.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    loadSubjects(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    loadChapters(selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    loadContent(selectedChapter);
    setEditingId(null);
    setForm({
      type: "lecture",
      title: "",
      description: "",
      youtubeUrl: "",
      fileUrl: "",
      externalUrl: "",
      durationMinutes: "",
      pagesCount: "",
      maxMarks: "",
    });
  }, [selectedChapter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedChapter) {
      setError("Select a chapter first.");
      return;
    }

    const payload = {
      chapterId: selectedChapter,
      type: form.type,
      title: form.title,
      description: form.description,
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
      if (editingId) {
        await updateContentItem(editingId, payload);
      } else {
        await createContentItem(payload);
      }

      setEditingId(null);
      setForm({
        type: "lecture",
        title: "",
        description: "",
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
      setError("Failed to save content item.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      type: item.type || "lecture",
      title: item.title || "",
      description: item.description || "",
      youtubeUrl: item.youtubeUrl || "",
      fileUrl: item.fileUrl || "",
      externalUrl: item.externalUrl || "",
      durationMinutes: item.durationMinutes || "",
      pagesCount: item.pagesCount || "",
      maxMarks: item.maxMarks || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await deleteContentItem(id);
      loadContent(selectedChapter);
    } catch (err) {
      console.error(err);
      setError("Failed to delete content item.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      type: "lecture",
      title: "",
      description: "",
      youtubeUrl: "",
      fileUrl: "",
      externalUrl: "",
      durationMinutes: "",
      pagesCount: "",
      maxMarks: "",
    });
  };

  return (
    <div>
      <h1 className="admin-page-title">Content</h1>
      <p className="admin-page-subtitle">
        Attach lectures, notes, tests, and books under each chapter.
      </p>

      {/* selection */}
      <div className="admin-card admin-inline">
        <div className="admin-form-row">
          <label>Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
            {classes.length === 0 && (
              <option value="">No classes available</option>
            )}
          </select>
        </div>

        <div className="admin-form-row">
          <label>Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
            {subjects.length === 0 && (
              <option value="">No subjects available</option>
            )}
          </select>
        </div>

        <div className="admin-form-row">
          <label>Chapter</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            {chapters.map((c) => (
              <option key={c._id} value={c._id}>
                {c.chapterNumber
                  ? `${c.chapterNumber}. ${c.title}`
                  : c.title}
              </option>
            ))}
            {chapters.length === 0 && (
              <option value="">No chapters available</option>
            )}
          </select>
        </div>
      </div>

      {/* form */}
      <div className="admin-card">
        <h2>{editingId ? "Edit Content Item" : "Add Content Item"}</h2>
        {error && <p className="admin-error">{error}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-inline">
            <div className="admin-form-row">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
              >
                <option value="lecture">Lecture</option>
                <option value="note">Note</option>
                <option value="test">Test</option>
                <option value="book">Book</option>
              </select>
            </div>

            <div className="admin-form-row">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="admin-inline">
            <div className="admin-form-row">
              <label>YouTube URL</label>
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, youtubeUrl: e.target.value }))
                }
              />
            </div>
            <div className="admin-form-row">
              <label>File URL (PDF, etc.)</label>
              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
              />
            </div>
            <div className="admin-form-row">
              <label>External URL (forms, books, etc.)</label>
              <input
                type="url"
                value={form.externalUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, externalUrl: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="admin-inline">
            <div className="admin-form-row">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationMinutes: e.target.value }))
                }
              />
            </div>
            <div className="admin-form-row">
              <label>Pages Count</label>
              <input
                type="number"
                value={form.pagesCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pagesCount: e.target.value }))
                }
              />
            </div>
            <div className="admin-form-row">
              <label>Max Marks (for tests)</label>
              <input
                type="number"
                value={form.maxMarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxMarks: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="admin-inline">
            <button type="submit" className="gs-btn">
              {editingId ? "Update Content" : "Add Content"}
            </button>
            {editingId && (
              <button
                type="button"
                className="gs-btn gs-btn--ghost"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* list */}
      <div className="admin-card">
        <h2>Existing Content</h2>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Links</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>
                    {item.youtubeUrl && <span>YT </span>}
                    {item.fileUrl && <span>File </span>}
                    {item.externalUrl && <span>Link</span>}
                  </td>
                  <td>
                    <button
                      className="admin-table-btn"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-table-btn admin-table-btn--danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {contentItems.length === 0 && (
                <tr>
                  <td colSpan="4">No content added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

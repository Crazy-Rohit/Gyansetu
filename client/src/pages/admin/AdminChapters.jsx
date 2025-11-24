import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  fetchSubjectsByClass,
  fetchChaptersBySubject,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../../api/adminApi";

export default function AdminChapters() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [form, setForm] = useState({
    title: "",
    chapterNumber: "",
    description: "",
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
      return;
    }
    try {
      const data = await fetchChaptersBySubject(subjectId);
      setChapters(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chapters.");
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
    setEditingId(null);
    setForm({ title: "", chapterNumber: "", description: "" });
  }, [selectedSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedSubject) {
      setError("Select a subject first.");
      return;
    }

    try {
      if (editingId) {
        await updateChapter(editingId, {
          ...form,
          chapterNumber: form.chapterNumber
            ? Number(form.chapterNumber)
            : undefined,
        });
      } else {
        await createChapter({
          subjectId: selectedSubject,
          title: form.title,
          chapterNumber: form.chapterNumber
            ? Number(form.chapterNumber)
            : undefined,
          description: form.description,
        });
      }
      setForm({ title: "", chapterNumber: "", description: "" });
      setEditingId(null);
      loadChapters(selectedSubject);
    } catch (err) {
      console.error(err);
      setError("Failed to save chapter.");
    }
  };

  const startEdit = (ch) => {
    setEditingId(ch._id);
    setForm({
      title: ch.title || "",
      chapterNumber: ch.chapterNumber || "",
      description: ch.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this chapter and all its content?")) return;
    try {
      await deleteChapter(id);
      loadChapters(selectedSubject);
    } catch (err) {
      console.error(err);
      setError("Failed to delete chapter.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", chapterNumber: "", description: "" });
  };

  return (
    <div>
      <h1 className="admin-page-title">Chapters</h1>
      <p className="admin-page-subtitle">
        Add chapters under each subject, then attach content.
      </p>

      <div className="admin-card admin-inline">
        <div className="admin-form-row">
          <label>Select Class</label>
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
          <label>Select Subject</label>
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
      </div>

      <div className="admin-card">
        <h2>{editingId ? "Edit Chapter" : "Add Chapter"}</h2>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>Title</label>
            <input
              type="text"
              placeholder="Number Systems"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="admin-form-row">
            <label>Chapter Number</label>
            <input
              type="number"
              value={form.chapterNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, chapterNumber: e.target.value }))
              }
            />
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
            <button type="submit" className="gs-btn">
              {editingId ? "Update Chapter" : "Add Chapter"}
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

      <div className="admin-card">
        <h2>Existing Chapters</h2>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((ch) => (
                <tr key={ch._id}>
                  <td>{ch.chapterNumber}</td>
                  <td>{ch.title}</td>
                  <td>{ch.description}</td>
                  <td>
                    <button
                      className="admin-table-btn"
                      onClick={() => startEdit(ch)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-table-btn admin-table-btn--danger"
                      onClick={() => handleDelete(ch._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan="4">No chapters added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

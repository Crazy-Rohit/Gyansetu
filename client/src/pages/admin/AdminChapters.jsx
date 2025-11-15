import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  fetchSubjectsByClass,
  fetchChaptersBySubject,
  createChapter,
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

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setSubjects([]);
      setSelectedSubject("");
      setChapters([]);
      loadSubjects(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject);
    }
  }, [selectedSubject]);

  const handleChangeForm = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedSubject || !form.title) {
      setError("Subject and chapter title are required.");
      return;
    }
    try {
      await createChapter({
        subjectId: selectedSubject,
        title: form.title,
        chapterNumber: form.chapterNumber ? Number(form.chapterNumber) : undefined,
        description: form.description,
      });
      setForm({ title: "", chapterNumber: "", description: "" });
      loadChapters(selectedSubject);
    } catch (err) {
      console.error(err);
      setError("Failed to create chapter.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Chapters</h1>
      <p className="admin-page-subtitle">
        Manage chapters for each subject (e.g., Number Systems, Polynomials, etc.).
      </p>

      <div className="admin-card">
        <div className="admin-inline">
          <div className="admin-form-row">
            <label>Select Class</label>
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
            <label>Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Subject --</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <h3>Add New Chapter</h3>
        <form onSubmit={handleCreateChapter}>
          <div className="admin-form-row">
            <label>Chapter Title</label>
            <input
              type="text"
              placeholder="Number Systems"
              value={form.title}
              onChange={handleChangeForm("title")}
            />
          </div>
          <div className="admin-form-row">
            <label>Chapter Number</label>
            <input
              type="number"
              placeholder="1"
              value={form.chapterNumber}
              onChange={handleChangeForm("chapterNumber")}
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
          <button type="submit" className="gs-btn">
            Save Chapter
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>Chapters for Selected Subject</h3>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((ch) => (
                <tr key={ch._id}>
                  <td>{ch.chapterNumber || "-"}</td>
                  <td>{ch.title}</td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan="2">No chapters added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

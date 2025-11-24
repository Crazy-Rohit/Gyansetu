import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  fetchSubjectsByClass,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../api/adminApi";

export default function AdminSubjects() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({ name: "", code: "", description: "" });
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
      return;
    }
    try {
      const data = await fetchSubjectsByClass(classId);
      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load subjects.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    loadSubjects(selectedClass);
    setEditingId(null);
    setForm({ name: "", code: "", description: "" });
  }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedClass) {
      setError("Select a class first.");
      return;
    }

    try {
      if (editingId) {
        await updateSubject(editingId, form);
      } else {
        await createSubject({
          classLevelId: selectedClass,
          ...form,
        });
      }
      setForm({ name: "", code: "", description: "" });
      setEditingId(null);
      loadSubjects(selectedClass);
    } catch (err) {
      console.error(err);
      setError("Failed to save subject.");
    }
  };

  const startEdit = (subj) => {
    setEditingId(subj._id);
    setForm({
      name: subj.name || "",
      code: subj.code || "",
      description: subj.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject and its chapters/content?")) {
      return;
    }
    try {
      await deleteSubject(id);
      loadSubjects(selectedClass);
    } catch (err) {
      console.error(err);
      setError("Failed to delete subject.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", description: "" });
  };

  return (
    <div>
      <h1 className="admin-page-title">Subjects</h1>
      <p className="admin-page-subtitle">
        Add subjects for each class (e.g., Mathematics).
      </p>

      <div className="admin-card">
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
      </div>

      <div className="admin-card">
        <h2>{editingId ? "Edit Subject" : "Add Subject"}</h2>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>Name</label>
            <input
              type="text"
              placeholder="Mathematics"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="admin-form-row">
            <label>Code</label>
            <input
              type="text"
              placeholder="MATH9, MATH10..."
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value }))
              }
              required
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
              {editingId ? "Update Subject" : "Add Subject"}
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
        <h2>Existing Subjects</h2>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.code}</td>
                  <td>
                    <button
                      className="admin-table-btn"
                      onClick={() => startEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-table-btn admin-table-btn--danger"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="3">No subjects added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import "../../styles/admin.css";
import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../../api/adminApi";

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [editingId, setEditingId] = useState(null);
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

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateClass(editingId, form);
      } else {
        await createClass(form);
      }
      setForm({ name: "", code: "", description: "" });
      setEditingId(null);
      loadClasses();
    } catch (err) {
      console.error(err);
      setError("Failed to save class.");
    }
  };

  const startEdit = (cls) => {
    setEditingId(cls._id);
    setForm({
      name: cls.name || "",
      code: cls.code || "",
      description: cls.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class and all its data?")) return;
    try {
      await deleteClass(id);
      loadClasses();
    } catch (err) {
      console.error(err);
      setError("Failed to delete class.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", description: "" });
  };

  return (
    <div>
      <h1 className="admin-page-title">Classes</h1>
      <p className="admin-page-subtitle">
        Add and manage classes (e.g., Class 9, Class 10).
      </p>

      <div className="admin-card">
        <h2>{editingId ? "Edit Class" : "Add Class"}</h2>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>Name</label>
            <input
              type="text"
              placeholder="Class 9"
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
              placeholder="9"
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
              placeholder="Short description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="admin-inline">
            <button type="submit" className="gs-btn">
              {editingId ? "Update Class" : "Add Class"}
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
        <h2>Existing Classes</h2>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td>{cls.name}</td>
                  <td>{cls.code}</td>
                  <td>{cls.description}</td>
                  <td>
                    <button
                      className="admin-table-btn"
                      onClick={() => startEdit(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-table-btn admin-table-btn--danger"
                      onClick={() => handleDelete(cls._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan="4">No classes added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

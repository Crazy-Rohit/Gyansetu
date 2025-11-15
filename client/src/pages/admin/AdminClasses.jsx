import { useEffect, useState } from "react";
import "../../styles/admin.css";
import { fetchClasses, createClass } from "../../api/adminApi";

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
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

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.code) {
      setError("Name and code are required.");
      return;
    }
    try {
      await createClass(form);
      setForm({ name: "", code: "", description: "" });
      loadClasses();
    } catch (err) {
      console.error(err);
      setError("Failed to create class.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Classes</h1>
      <p className="admin-page-subtitle">
        Add and manage classes (like Class 9, Class 10).
      </p>

      <div className="admin-card">
        <h3>Add New Class</h3>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>Class Name</label>
            <input
              type="text"
              placeholder="Class 9"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="admin-form-row">
            <label>Code</label>
            <input
              type="text"
              placeholder="9"
              value={form.code}
              onChange={handleChange("code")}
            />
          </div>
          <div className="admin-form-row">
            <label>Description</label>
            <textarea
              rows="2"
              placeholder="NCERT Class 9 Mathematics..."
              value={form.description}
              onChange={handleChange("description")}
            />
          </div>
          <button type="submit" className="gs-btn">
            Save Class
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>Existing Classes</h3>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td>{cls.name}</td>
                  <td>{cls.code}</td>
                  <td>{cls.description || "-"}</td>
                </tr>
              ))}
              {classes.length === 0 && (
                <tr>
                  <td colSpan="3">No classes added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import "../../styles/admin.css";
import { fetchClasses, fetchSubjectsByClass, createSubject } from "../../api/adminApi";

export default function AdminSubjects() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
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
    if (!classId) return;
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
    if (selectedClass) {
      loadSubjects(selectedClass);
    }
  }, [selectedClass]);

  const handleChangeForm = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedClass || !form.name || !form.code) {
      setError("Class, name and code are required.");
      return;
    }
    try {
      await createSubject({
        classLevelId: selectedClass,
        name: form.name,
        code: form.code,
        description: form.description,
      });
      setForm({ name: "", code: "", description: "" });
      loadSubjects(selectedClass);
    } catch (err) {
      console.error(err);
      setError("Failed to create subject.");
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Subjects</h1>
      <p className="admin-page-subtitle">
        Add subjects under a class (e.g., Mathematics under Class 9 and 10).
      </p>

      <div className="admin-card">
        <div className="admin-form-row">
          <label>Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} ({cls.code})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <h3>Add New Subject</h3>
        <form onSubmit={handleCreateSubject}>
          <div className="admin-form-row">
            <label>Subject Name</label>
            <input
              type="text"
              placeholder="Mathematics"
              value={form.name}
              onChange={handleChangeForm("name")}
            />
          </div>
          <div className="admin-form-row">
            <label>Code</label>
            <input
              type="text"
              placeholder="MATH9"
              value={form.code}
              onChange={handleChangeForm("code")}
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
            Save Subject
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3>Subjects for Selected Class</h3>
        <div className="admin-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subj) => (
                <tr key={subj._id}>
                  <td>{subj.name}</td>
                  <td>{subj.code}</td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="2">No subjects added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

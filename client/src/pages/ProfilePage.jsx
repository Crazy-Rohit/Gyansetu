// client/src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile, updateMyProfile } from "../api/userApi";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user, setUser } = useAuth ? useAuth() : { user: null, setUser: null };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    classLevel: "",
    address: "",
    institution: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load profile on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const profile = await getMyProfile();

        setForm({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          role: profile.role || "",
          classLevel: profile.classLevel || "",
          address: profile.address || "",
          institution: profile.institution || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        phone: form.phone,
        classLevel: form.classLevel,
        address: form.address,
        institution: form.institution,
      };

      const updated = await updateMyProfile(payload);

      setForm((prev) => ({
        ...prev,
        name: updated.name || "",
        phone: updated.phone || "",
        classLevel: updated.classLevel || "",
        address: updated.address || "",
        institution: updated.institution || "",
      }));

      // If AuthContext supports setUser, keep it in sync
      if (typeof setUser === "function") {
        setUser(updated);
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="profile-page">
        <div className="gs-container">
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="gs-container">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">
          View and update your personal and academic details used across Gyan Setu.
        </p>

        {error && <p className="courses-error">{error}</p>}
        {message && <p className="profile-success">{message}</p>}

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-field">
            <label>Email (login)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
            />
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              readOnly
            />
          </div>

          {/* Academic / extra info */}
          <div className="profile-field">
            <label>Class Level</label>
            <input
              type="text"
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              placeholder="e.g., Class 9"
            />
          </div>

          <div className="profile-field">
            <label>Institution / School</label>
            <input
              type="text"
              name="institution"
              value={form.institution}
              onChange={handleChange}
              placeholder="Your school / college"
            />
          </div>

          <div className="profile-field">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="City, State (optional)"
            />
          </div>

          <button
            type="submit"
            className="gs-btn gs-btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </section>
  );
}

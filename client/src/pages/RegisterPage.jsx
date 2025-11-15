import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    institution: "",
    role: "student",
    classLevel: "9", // '9' or '10'
    loginMethod: "email",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const goToStep2 = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Name and contact number are required.");
      return;
    }

    if (form.role === "student" && !form.classLevel) {
      setError("Please select your class.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.password || !form.confirmPassword) {
      setError("Please enter and confirm your password.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = await register(form);
    if (result.success) {
      navigate("/"); // later go to dashboard
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="register-page">
      <div className="gs-container">
        <div className="auth-card">
          <h1>Register</h1>
          <p className="auth-subtitle">
            Create your Gyan Setu account to access Class 9 and 10 Maths content.
          </p>

          <div className="step-indicator">
            <span className={step === 1 ? "active" : ""}>1. Basic Details</span>
            <span className={step === 2 ? "active" : ""}>2. Login Setup</span>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {step === 1 && (
            <form onSubmit={goToStep2} className="auth-form">
              <div className="form-row">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>

              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>

              <div className="form-row">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  required
                />
              </div>

              <div className="form-row">
                <label>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange("address")}
                />
              </div>

              <div className="form-row">
                <label>School / University / Institution</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={handleChange("institution")}
                />
              </div>

              <div className="form-row">
                <label>Registering as</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={form.role === "student"}
                      onChange={handleChange("role")}
                    />
                    Student
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={form.role === "teacher"}
                      onChange={handleChange("role")}
                    />
                    Teacher / Faculty
                  </label>
                </div>
              </div>

              {form.role === "student" && (
                <div className="form-row">
                  <label>Class</label>
                  <select
                    value={form.classLevel}
                    onChange={handleChange("classLevel")}
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </div>
              )}

              <button type="submit" className="gs-btn auth-btn">
                Next: Login Setup →
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <label>Sign up using</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="loginMethod"
                      value="email"
                      checked={form.loginMethod === "email"}
                      onChange={handleChange("loginMethod")}
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="loginMethod"
                      value="phone"
                      checked={form.loginMethod === "phone"}
                      onChange={handleChange("loginMethod")}
                    />
                    Phone Number
                  </label>
                </div>
              </div>

              <div className="form-row">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
              </div>

              <div className="form-row">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  required
                />
              </div>

              <div className="auth-actions">
                <button
                  type="button"
                  className="gs-btn gs-btn--ghost"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button type="submit" className="gs-btn" disabled={loading}>
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// src/components/Layout/Header.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/gyansetu-logo.png";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  // 👉 NEW: handle click on name to open profile page
  const handleProfileClick = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const displayName =
    user?.name || user?.fullName || user?.email || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="gs-header">
      <div className="gs-container gs-header-inner">
        <Link to="/" className="gs-logo">
          <img src={logo} alt="Gyan Setu Logo" />
          <span>Gyan Setu</span>
        </Link>

        <nav className="gs-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="gs-header-actions">
          {/* When NOT logged in → show Login + Register */}
          {!user && (
            <>
              <Link to="/login" className="gs-btn gs-btn--ghost">
                Login
              </Link>
              <Link to="/register" className="gs-btn">
                Register
              </Link>
            </>
          )}

          {/* When logged in → show user avatar with dropdown */}
          {user && (
            <div
              className="gs-user-menu"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                type="button"
                className="gs-user-avatar"
                title={displayName} // shows full name on hover
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span className="gs-user-initials">{initials}</span>
              </button>

              {menuOpen && (
                <div className="gs-user-dropdown">
                  {/* 👇 CLICKING NAME GOES TO /profile */}
                  <button
                    type="button"
                    className="gs-user-dropdown-name"
                    onClick={handleProfileClick}
                  >
                    {displayName}
                  </button>

                  <button
                    type="button"
                    className="gs-user-dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

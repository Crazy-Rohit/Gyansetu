import { Link } from "react-router-dom";
import logo from "../../assets/images/gyansetu-logo.webp";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="gs-footer">
      <div className="gs-container gs-footer-grid">
        <div className="gs-footer-brand">
          <Link to="/" className="gs-footer-logo">
            <img src={logo} alt="Gyan Setu Logo" className="gs-footer-logo__img" />
            <span>Gyan Setu</span>
          </Link>
          <p>Building bridges to mathematical mastery through tactile, warm, and engaging learning experiences.</p>
        </div>

        <div className="gs-footer-col">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/challenges">Challenges</Link>
          <Link to="/my-badges">My Badges</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="gs-footer-col">
          <h3>Contact</h3>
          <p>info@gyansetu.com</p>
          <p>+91-XXXXXXXXXX</p>
          <div className="gs-footer-icons">
            <span className="material-symbols-outlined">mail</span>
            <span className="material-symbols-outlined">share</span>
          </div>
        </div>
      </div>

      <div className="gs-footer-bottom">
        <p>© {new Date().getFullYear()} Gyan Setu. Empowering the next generation of mathematicians.</p>
      </div>
    </footer>
  );
}

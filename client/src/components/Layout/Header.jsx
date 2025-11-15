import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/gyansetu-logo.png';
import './Header.css';

export default function Header() {
  return (
    <header className="gs-header">
      <div className="gs-container gs-header-inner">
        <Link to="/" className="gs-logo">
          <img src={logo} alt="Gyan Setu Logo" />
          <span>Gyan Setu</span>
        </Link>

        <nav className="gs-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="gs-header-actions">
          <Link to="/login" className="gs-btn gs-btn--ghost">Login</Link>
          <Link to="/register" className="gs-btn">Register</Link>
        </div>
      </div>
    </header>
  );
}

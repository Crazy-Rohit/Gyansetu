import { Link } from 'react-router-dom';
import '../styles/home.css';
import banner from '../assets/images/banner.png';
import { useAuth } from "../context/AuthContext";    // ← added

export default function HomePage() {
  const { user } = useAuth();   // ← added

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="gs-container home-hero-inner">
          <div className="home-hero-text">
            <span className="home-tagline">Class 9 & 10 • NCERT Mathematics</span>
            <h1>Gyan Setu Coaching Center</h1>
            <p>
              Focused coaching for Class 9th and 10th Mathematics (NCERT). 
              Clear concepts, regular practice, and personal attention to help students build a strong foundation.
            </p>
            <div className="home-hero-actions">
              <Link to="/courses" className="gs-btn">View Courses</Link>

              {/* ❌ Hide "Join as Student" if user is logged in */}
              {!user && (
                <Link to="/register" className="gs-btn gs-btn--ghost">
                  Join as Student
                </Link>
              )}
            </div>
          </div>

          <div className="home-hero-image">
            <img src={banner} alt="Gyan Setu Coaching - Students learning" />
          </div>
        </div>
      </section>

      <section className="home-classes">
        <div className="gs-container">
          <h2>What We Offer</h2>
          <p className="home-section-subtitle">
            Structured NCERT-based Mathematics coaching for both Class 9 and Class 10.
          </p>

          <div className="home-class-grid">
            <div className="home-class-card">
              <h3>Class 9 Mathematics</h3>
              <p>
                Complete NCERT Maths syllabus with chapter-wise lectures, notes, tests, and book references.
              </p>
              <ul>
                <li>Concept-building lectures</li>
                <li>Handwritten & printed notes</li>
                <li>Chapter-wise tests</li>
              </ul>
              <Link to="/courses" className="home-card-link">Explore Class 9 →</Link>
            </div>

            <div className="home-class-card">
              <h3>Class 10 Mathematics</h3>
              <p>
                Board-focused preparation with NCERT coverage, previous year questions, and extra practice.
              </p>
              <ul>
                <li>Board exam–oriented approach</li>
                <li>Important questions & summaries</li>
                <li>Regular mock tests</li>
              </ul>
              <Link to="/courses" className="home-card-link">Explore Class 10 →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

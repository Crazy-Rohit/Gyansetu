import { Link } from 'react-router-dom';
import '../styles/course.css';

export default function CoursesPage() {
  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1>Courses</h1>
        <p className="courses-subtitle">
          Currently we offer coaching for <strong>Class 9</strong> and <strong>Class 10</strong> Mathematics (NCERT syllabus).
        </p>

        <div className="courses-grid">
          <div className="course-card">
            <span className="course-badge">NCERT Maths</span>
            <h2>Class 9 Mathematics</h2>
            <p>
              Chapter-wise explanation, notes, tests, and book references aligned strictly to NCERT.
            </p>
            <ul>
              <li>NCERT Chapter sequence</li>
              <li>Video lectures for each chapter</li>
              <li>Notes, tests, and reference books</li>
            </ul>
            <Link to="/login" className="gs-btn course-btn">Access as Student</Link>
          </div>

          <div className="course-card">
            <span className="course-badge">NCERT Maths</span>
            <h2>Class 10 Mathematics</h2>
            <p>
              Board-focused Maths coaching, with NCERT coverage and exam-oriented practice.
            </p>
            <ul>
              <li>Concept + Board preparation blend</li>
              <li>Chapter-wise tests and revisions</li>
              <li>Previous year question practice</li>
            </ul>
            <Link to="/login" className="gs-btn course-btn">Access as Student</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

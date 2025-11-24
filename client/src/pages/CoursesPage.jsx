// client/src/pages/CoursesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/course.css";
import { fetchPublicClasses } from "../api/courseApi";

export default function CoursesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPublicClasses();
        setClasses(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1>Courses</h1>
        <p className="courses-subtitle">
          Explore all classes and subjects added by the administrator.
        </p>

        {error && <p className="courses-error">{error}</p>}
        {loading && <p>Loading courses...</p>}

        {!loading && classes.length === 0 && (
          <p>No courses available yet. Please contact the administrator.</p>
        )}

        <div className="courses-grid">
          {classes.map((cls) => (
            <div className="course-card" key={cls._id}>
              <span className="course-badge">Class</span>
              <h2>{cls.name}</h2>
              {cls.description && <p>{cls.description}</p>}
              <Link
                to={`/courses/${cls._id}`}
                className="gs-btn course-btn"
              >
                View Content
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

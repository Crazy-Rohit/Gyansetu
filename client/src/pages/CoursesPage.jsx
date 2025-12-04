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
        <h1 className="course-title">Courses</h1>
        <p className="courses-subtitle">
          Select a class to explore its subjects, chapters and content.
        </p>

        {error && <p className="courses-error">{error}</p>}
        {loading && <p>Loading courses...</p>}

        {!loading && classes.length === 0 && (
          <p className="muted">No classes available yet. Please contact admin.</p>
        )}

        <div className="courses-grid">
          {classes.map((cls) => (
            <Link
              key={cls._id}
              to={`/courses/${cls._id}`}
              className="course-card course-card--link"
            >
              <span className="course-badge">Class</span>
              <h2 className="course-card__title">{cls.name}</h2>
              {cls.description && (
                <p className="course-card__text">
                  {cls.description.slice(0, 100)}
                  {cls.description.length > 100 ? "..." : ""}
                </p>
              )}
              <span className="course-card__cta">See Subjects</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

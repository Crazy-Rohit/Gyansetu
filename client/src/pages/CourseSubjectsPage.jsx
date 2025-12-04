// client/src/pages/CourseSubjectsPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import { fetchPublicClasses, fetchPublicSubjects } from "../api/courseApi";

export default function CourseSubjectsPage() {
  const { classId } = useParams();

  const [clazz, setClazz] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);

        const classes = await fetchPublicClasses();
        const current = classes.find((c) => c._id === classId) || null;
        setClazz(current);

        const subj = await fetchPublicSubjects(classId);
        setSubjects(subj);
      } catch (err) {
        console.error(err);
        setError("Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId]);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">
          {clazz ? clazz.name : "Class"} – Subjects
        </h1>
        {clazz?.description && (
          <p className="courses-subtitle">{clazz.description}</p>
        )}

        {error && <p className="courses-error">{error}</p>}
        {loading && <p>Loading subjects...</p>}

        {!loading && subjects.length === 0 && (
          <p className="muted">No subjects added for this class yet.</p>
        )}

        <div className="courses-grid">
          {subjects.map((subject) => (
            <Link
              key={subject._id}
              to={`/courses/${classId}/${subject._id}`}
              className="course-card course-card--link"
            >
              <span className="course-badge">Subject</span>
              <h2 className="course-card__title">{subject.name}</h2>
              {subject.description && (
                <p className="course-card__text">
                  {subject.description.slice(0, 100)}
                  {subject.description.length > 100 ? "..." : ""}
                </p>
              )}
              <span className="course-card__cta">See Chapters</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

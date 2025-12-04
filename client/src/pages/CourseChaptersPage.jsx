// client/src/pages/CourseChaptersPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  fetchPublicClasses,
  fetchPublicSubjects,
  fetchPublicChapters,
} from "../api/courseApi";

export default function CourseChaptersPage() {
  const { classId, subjectId } = useParams();

  const [clazz, setClazz] = useState(null);
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);

        const classes = await fetchPublicClasses();
        const currentClass = classes.find((c) => c._id === classId) || null;
        setClazz(currentClass);

        const subj = await fetchPublicSubjects(classId);
        const currentSubject = subj.find((s) => s._id === subjectId) || null;
        setSubject(currentSubject);

        const chaps = await fetchPublicChapters(subjectId);
        setChapters(chaps);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapters.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId, subjectId]);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">
          {clazz ? clazz.name : "Class"} ›{" "}
          {subject ? subject.name : "Subject"} – Chapters
        </h1>

        {subject?.description && (
          <p className="courses-subtitle">{subject.description}</p>
        )}

        {error && <p className="courses-error">{error}</p>}
        {loading && <p>Loading chapters...</p>}

        {!loading && chapters.length === 0 && (
          <p className="muted">No chapters added for this subject yet.</p>
        )}

        <div className="courses-grid">
          {chapters.map((chapter) => (
            <Link
              key={chapter._id}
              to={`/courses/${classId}/${subjectId}/${chapter._id}`}
              className="course-card course-card--link"
            >
              <span className="course-badge">Chapter</span>
              <h2 className="course-card__title">
                {chapter.chapterNumber
                  ? `${chapter.chapterNumber}. ${chapter.title}`
                  : chapter.title}
              </h2>
              {chapter.description && (
                <p className="course-card__text">
                  {chapter.description.slice(0, 100)}
                  {chapter.description.length > 100 ? "..." : ""}
                </p>
              )}
              <span className="course-card__cta">View Content</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

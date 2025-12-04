// client/src/pages/ChapterContentOverviewPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  fetchPublicClasses,
  fetchPublicSubjects,
  fetchPublicChapters,
  fetchPublicContent,
} from "../api/courseApi";

export default function ChapterContentOverviewPage() {
  const { classId, subjectId, chapterId } = useParams();

  const [clazz, setClazz] = useState(null);
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState(null);

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
        const currentChapter = chaps.find((c) => c._id === chapterId) || null;
        setChapter(currentChapter);

        const chapterContent = await fetchPublicContent(chapterId);
        setContent(chapterContent);
      } catch (err) {
        console.error(err);
        setError("Failed to load content overview.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId, subjectId, chapterId]);

  const breadcrumbTitle = () => {
    const parts = [];
    if (clazz) parts.push(clazz.name);
    if (subject) parts.push(subject.name);
    if (chapter) parts.push(chapter.title);
    return parts.join(" › ");
  };

  // Build the 4 type cards
  const lectureCount = content?.lectures?.length || 0;
  const notesCount = content?.notes?.length || 0;
  const testsCount = content?.tests?.length || 0;
  const booksCount = content?.books?.length || 0;

  const sections = [
    {
      key: "lectures",
      label: "Lectures",
      badge: "Videos",
      description:
        "Concept-wise video lectures and explanations for this chapter.",
      count: lectureCount,
    },
    {
      key: "notes",
      label: "Notes",
      badge: "Notes",
      description:
        "Chapter-wise notes, summaries and important points to revise.",
      count: notesCount,
    },
    {
      key: "tests",
      label: "Tests",
      badge: "Practice",
      description:
        "Practice questions, tests and assignments to check your understanding.",
      count: testsCount,
    },
    {
      key: "books",
      label: "Books",
      badge: "Books",
      description:
        "Textbook references, additional books and PDF resources.",
      count: booksCount,
    },
  ];

  return (
    <section className="courses-page">
      <div className="gs-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/courses" className="breadcrumb-link">
            Courses
          </Link>
          {clazz && (
            <>
              <span className="breadcrumb-sep">›</span>
              <Link
                to={`/courses/${classId}`}
                className="breadcrumb-link breadcrumb-strong"
              >
                {clazz.name}
              </Link>
            </>
          )}
          {subject && (
            <>
              <span className="breadcrumb-sep">›</span>
              <Link
                to={`/courses/${classId}/${subjectId}`}
                className="breadcrumb-link breadcrumb-strong"
              >
                {subject.name}
              </Link>
            </>
          )}
          {chapter && (
            <>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{chapter.title}</span>
            </>
          )}
        </nav>

        <h1 className="course-title">{breadcrumbTitle()} – Resources</h1>

        {chapter?.description && (
          <p className="courses-subtitle">{chapter.description}</p>
        )}

        {error && <p className="courses-error">{error}</p>}
        {loading && <p>Loading resources...</p>}

        <div className="courses-grid">
          {sections.map((section) => (
            <Link
              key={section.key}
              to={`/courses/${classId}/${subjectId}/${chapterId}/${section.key}`}
              className="course-card course-card--link"
            >
              <span className="course-badge">{section.badge}</span>

              <h2 className="course-card__title">{section.label}</h2>

              <p className="course-card__text">
                {section.description}
              </p>

              <p className="course-card__text">
                {section.count} item{section.count !== 1 ? "s" : ""} available
              </p>

              <span className="course-card__cta">View {section.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

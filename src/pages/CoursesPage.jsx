// client/src/pages/CoursesPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/course.css";
import { getClasses, searchChapters } from "../data/coursesData";
import { useUserProfile } from "../hooks/useUserProfile";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

export default function CoursesPage() {
  const { profile, openModal } = useUserProfile();
  const classPref = profile?.classPref || "both";
  const isFiltered = classPref !== "both";

  const classes = getClasses().filter((cls) => !isFiltered || cls.id === classPref);
  const [query, setQuery] = useState("");

  const results = searchChapters(query).filter((r) => !isFiltered || r.classId === classPref);
  const isSearching = query.trim().length > 0;

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">Courses</h1>
        <p className="courses-subtitle">
          Select a class to explore its subjects, chapters and content.
        </p>

        {isFiltered && (
          <button type="button" className="courses-class-filter-chip" onClick={openModal}>
            <span className="material-symbols-outlined">filter_alt</span>
            <span>
              Showing <strong>{classPref === "class-9" ? "Class 9" : "Class 10"}</strong> only
            </span>
            <span className="courses-class-filter-chip__change">Change</span>
          </button>
        )}

        <div className="course-search">
          <svg className="course-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a chapter, subject or class..."
            aria-label="Search chapters"
          />
        </div>

        {isSearching ? (
          <div className="search-results">
            {results.length === 0 && (
              <p className="muted">No chapters match "{query}".</p>
            )}
            {results.map((r) => (
              <Link
                key={`${r.classId}-${r.subjectId}-${r.chapterId}`}
                to={`/courses/${r.classId}/${r.subjectId}/${r.chapterId}`}
                className="search-result-row"
              >
                <span className="search-result-row__title">{r.chapterTitle}</span>
                <span className="search-result-row__path">
                  {r.className} › {r.subjectName}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {classes.length === 0 && (
              <p className="muted">No classes available yet. Please contact admin.</p>
            )}

            <Reveal className="courses-grid">
              {classes.map((cls) => (
                <TiltCard
                  as={Link}
                  key={cls.id}
                  to={`/courses/${cls.id}`}
                  className="course-card course-card--link"
                  intensity={6}
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
                </TiltCard>
              ))}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

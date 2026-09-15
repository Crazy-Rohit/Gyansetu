// client/src/pages/ChapterContentOverviewPage.jsx
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  getClassById,
  getSubjectById,
  getChapterById,
  getContentByChapter,
} from "../data/coursesData";
import { getQuizForChapter } from "../data/quizData";
import { getChapterProgress } from "../utils/quizProgress";
import { getYouTubeThumbnail } from "../utils/youtube";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const ICONS = {
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M6.5 3h11l-.6 6.2a4.9 4.9 0 0 1-9.8 0L6.5 3Z" />
      <path d="M6.5 5H3.8A2.3 2.3 0 0 0 5 9.2M17.5 5h2.7A2.3 2.3 0 0 1 19 9.2" />
    </svg>
  ),
  lectures: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="14" height="13" rx="2" />
      <path d="M16.5 10.2 21 7.5v9l-4.5-2.7" />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.5h9l3 3V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M15 2.5V6h4M8 11h8M8 15h8M8 19h5" />
    </svg>
  ),
  tests: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="m7 12 3 3 7-7" />
    </svg>
  ),
  books: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5c2.5-1 5.5-1 8 0v15c-2.5-1-5.5-1-8 0v-15Z" />
      <path d="M20 4.5c-2.5-1-5.5-1-8 0v15c2.5-1 5.5-1 8 0v-15Z" />
    </svg>
  ),
};

export default function ChapterContentOverviewPage() {
  const { classId, subjectId, chapterId } = useParams();

  const clazz = getClassById(classId);
  const subject = getSubjectById(classId, subjectId);
  const chapter = getChapterById(classId, subjectId, chapterId);
  const content = getContentByChapter(classId, subjectId, chapterId);
  const quiz = getQuizForChapter(classId, subjectId, chapterId);
  const progress = quiz ? getChapterProgress(classId, subjectId, chapterId) : null;

  const breadcrumbTitle = () => {
    const parts = [];
    if (clazz) parts.push(clazz.name);
    if (subject) parts.push(subject.name);
    if (chapter) parts.push(chapter.title);
    return parts.join(" › ");
  };

  const totalLevels = quiz?.levels?.length || 0;
  const passedLevels = progress?.passedLevels.length || 0;
  const hasStarted = passedLevels > 0;
  const allPassed = totalLevels > 0 && passedLevels === totalLevels;

  const lectureCount = content.lectures?.length || 0;
  const lectureThumbnail = getYouTubeThumbnail(content.lectures?.[0]?.youtubeUrl);

  const smallSections = [
    {
      key: "quiz",
      label: "Quiz",
      badge: "Levels + Badges",
      tone: "secondary",
      description: quiz
        ? allPassed
          ? "All levels complete — retry any level to beat your best score."
          : `${totalLevels} levels with a per-question timer. Pass a level to unlock the next and earn a badge.`
        : "Level-wise quiz with a per-question timer — pass a level to unlock the next and earn a badge.",
      count: totalLevels,
      countLabel: "level",
      ctaOverride: quiz ? (allPassed ? "Review Quiz" : hasStarted ? "Continue Quiz" : "Start Quiz") : null,
    },
    {
      key: "notes",
      label: "Notes",
      badge: "Notes",
      tone: "tertiary",
      description: "Chapter-wise notes, summaries and important points to revise.",
      count: content.notes?.length || 0,
    },
    {
      key: "tests",
      label: "Tests",
      badge: "Practice",
      tone: "error",
      description: "Practice questions, tests and assignments to check your understanding.",
      count: content.tests?.length || 0,
    },
    {
      key: "books",
      label: "Books",
      badge: "Books",
      tone: "neutral",
      description: "Textbook references, additional books and PDF resources.",
      count: content.books?.length || 0,
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
              <Link to={`/courses/${classId}`} className="breadcrumb-link breadcrumb-strong">
                {clazz.name}
              </Link>
            </>
          )}
          {subject && (
            <>
              <span className="breadcrumb-sep">›</span>
              <Link to={`/courses/${classId}/${subjectId}`} className="breadcrumb-link breadcrumb-strong">
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

        <div className="chapter-overview-header">
          <div>
            <h1 className="course-title">{breadcrumbTitle()} – Resources</h1>
            {chapter?.description && <p className="courses-subtitle">{chapter.description}</p>}
          </div>

          {quiz && (
            <div className="mastery-gauge">
              <span className="mastery-gauge__label">Quiz Progress</span>
              <MasteryRing passed={passedLevels} total={totalLevels} />
            </div>
          )}
        </div>

        <div className="chapter-overview-grid">
          <TiltCard
            as={Link}
            to={`/courses/${classId}/${subjectId}/${chapterId}/lectures`}
            className="overview-feature-card overview-feature-card--secondary"
            intensity={5}
          >
            {lectureThumbnail ? (
              <div className="overview-feature-card__thumb">
                <img src={lectureThumbnail} alt="" loading="lazy" />
              </div>
            ) : (
              <span className="overview-feature-card__icon">{ICONS.lectures}</span>
            )}
            <h2 className="overview-feature-card__title">Video Lectures</h2>
            <p className="overview-feature-card__text">
              Concept-wise video lectures and explanations for this chapter — start here if
              you're new to the topic.
            </p>
            <span className="gs-btn overview-feature-card__cta">
              Watch Lectures ({lectureCount})
              <span className="material-symbols-outlined">arrow_forward</span>
            </span>
          </TiltCard>

          <Reveal className="chapter-overview-small-grid">
            {smallSections.map((section) => (
              <TiltCard
                as={Link}
                key={section.key}
                to={`/courses/${classId}/${subjectId}/${chapterId}/${section.key}`}
                className={`course-card course-card--link course-card--tint-${section.tone}`}
              >
                <span className={`course-card__icon course-card__icon--${section.tone}`}>
                  {ICONS[section.key]}
                </span>
                <span className="course-badge">{section.badge}</span>
                <h2 className="course-card__title">{section.label}</h2>
                <p className="course-card__text">{section.description}</p>
                <p className="course-card__text">
                  {section.count} {section.countLabel || "item"}
                  {section.count !== 1 ? "s" : ""} available
                </p>
                <span className="course-card__cta">
                  {section.ctaOverride || `View ${section.label}`}
                </span>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MasteryRing({ passed, total }) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="mastery-gauge__ring">
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={radius} className="mastery-gauge__track" strokeWidth="6" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className="mastery-gauge__fill"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="mastery-gauge__value">{pct}%</span>
    </div>
  );
}

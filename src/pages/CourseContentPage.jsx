// client/src/pages/CourseContentPage.jsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  getClassById,
  getSubjectById,
  getChapterById,
  getContentByChapter,
} from "../data/coursesData";
import { getYouTubeId } from "../utils/youtube";
import { withBase } from "../utils/publicPath";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

const VIEW_STORAGE_KEY = "gs_content_view";

const TYPE_CHIPS = [
  { key: "lectures", label: "Lectures" },
  { key: "notes", label: "Notes" },
  { key: "tests", label: "Tests" },
  { key: "books", label: "Books" },
];

export default function CourseContentPage() {
  const { classId, subjectId, chapterId, contentType } = useParams();
  const [view, setView] = useState(
    () => localStorage.getItem(VIEW_STORAGE_KEY) || "card"
  );

  const clazz = getClassById(classId);
  const subject = getSubjectById(classId, subjectId);
  const chapter = getChapterById(classId, subjectId, chapterId);
  const content = getContentByChapter(classId, subjectId, chapterId);

  const changeView = (next) => {
    setView(next);
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  };

  const breadcrumbTitle = () => {
    const parts = [];
    if (clazz) parts.push(clazz.name);
    if (subject) parts.push(subject.name);
    if (chapter) parts.push(chapter.title);
    const typeLabel = contentTypeLabel(contentType);
    if (typeLabel) parts.push(typeLabel);
    return parts.join(" › ");
  };

  const items = content[contentType] || [];

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
              <Link
                to={`/courses/${classId}/${subjectId}/${chapterId}`}
                className="breadcrumb-link breadcrumb-strong"
              >
                {chapter.title}
              </Link>
            </>
          )}
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">
            {contentTypeLabel(contentType)}
          </span>
        </nav>

        <div className="content-page-header">
          <h1 className="course-title">
            {breadcrumbTitle()} – {items.length} item
            {items.length !== 1 ? "s" : ""}
          </h1>

          {items.length > 0 && (
            <div className="view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                className={`view-toggle__btn ${view === "card" ? "view-toggle__btn--active" : ""}`}
                onClick={() => changeView("card")}
                aria-pressed={view === "card"}
                title="Card view"
              >
                <span className="material-symbols-outlined">grid_view</span>
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={`view-toggle__btn ${view === "list" ? "view-toggle__btn--active" : ""}`}
                onClick={() => changeView("list")}
                aria-pressed={view === "list"}
                title="List view"
              >
                <span className="material-symbols-outlined">view_list</span>
                <span>List</span>
              </button>
            </div>
          )}
        </div>

        <div className="filter-chips" role="tablist" aria-label="Content type">
          {TYPE_CHIPS.map((chip) => (
            <Link
              key={chip.key}
              to={`/courses/${classId}/${subjectId}/${chapterId}/${chip.key}`}
              role="tab"
              aria-selected={chip.key === contentType}
              className={`filter-chip ${chip.key === contentType ? "filter-chip--active" : ""}`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <p className="muted">
            No {contentTypeLabel(contentType).toLowerCase()} available for this
            chapter yet.
          </p>
        )}

        {items.length > 0 && (
          <ContentCards type={contentType} items={items} view={view} />
        )}
      </div>
    </section>
  );
}

function contentTypeLabel(type) {
  switch (type) {
    case "lectures":
      return "Lectures";
    case "notes":
      return "Notes";
    case "tests":
      return "Tests";
    case "books":
      return "Books";
    default:
      return "Content";
  }
}

function ContentLinks({ item }) {
  return (
    <div className="content-links">
      {item.youtubeUrl && (
        <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="content-link">
          Watch Video
        </a>
      )}
      {item.fileUrl && (
        <a href={withBase(item.fileUrl)} target="_blank" rel="noreferrer" className="content-link">
          Open File
        </a>
      )}
      {item.externalUrl && (
        <a href={item.externalUrl} target="_blank" rel="noreferrer" className="content-link">
          Open Link
        </a>
      )}
    </div>
  );
}

function ContentCards({ type, items, view }) {
  const isVideoType = type === "lectures";

  const withThumb = items.map((item) => {
    const youtubeId = isVideoType ? getYouTubeId(item.youtubeUrl) : null;
    const thumbnailUrl = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : null;
    return { item, thumbnailUrl };
  });

  if (view === "list") {
    return (
      <section className="content-group-card content-group-card--full">
        <Reveal className="content-items-list">
          {withThumb.map(({ item, thumbnailUrl }) => (
            <article className="content-list-row" key={item.id}>
              {thumbnailUrl && (
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="content-list-row__thumb"
                >
                  <img src={thumbnailUrl} alt={item.title} loading="lazy" />
                </a>
              )}
              <div className="content-list-row__body">
                <h4 className="content-item-title">{item.title}</h4>
                {item.description && (
                  <p className="content-item-text">{item.description}</p>
                )}
              </div>
              <ContentLinks item={item} />
            </article>
          ))}
        </Reveal>
      </section>
    );
  }

  return (
    <section className="content-group-card content-group-card--full">
      <Reveal className="courses-grid content-items-grid">
        {withThumb.map(({ item, thumbnailUrl }) => (
          <TiltCard as="article" className="course-card content-item-card" key={item.id} intensity={6}>
            {isVideoType && thumbnailUrl && (
              <a
                href={item.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="content-thumb-wrapper"
              >
                <img
                  src={thumbnailUrl}
                  alt={item.title}
                  className="content-thumb-img"
                  loading="lazy"
                />
                <span className="content-thumb-badge">Watch</span>
              </a>
            )}

            <div className="content-item-body">
              <h4 className="content-item-title">{item.title}</h4>
              {item.description && (
                <p className="content-item-text">
                  {item.description.slice(0, 140)}
                  {item.description.length > 140 ? "..." : ""}
                </p>
              )}

              <ContentLinks item={item} />
            </div>
          </TiltCard>
        ))}
      </Reveal>
    </section>
  );
}

// client/src/pages/CourseContentPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  fetchPublicClasses,
  fetchPublicSubjects,
  fetchPublicChapters,
  fetchPublicContent,
} from "../api/courseApi";

export default function CourseContentPage() {
  const { classId, subjectId, chapterId, contentType } = useParams();

  const [clazz, setClazz] = useState(null);
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState(null);

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeta = async () => {
      try {
        setError("");
        setLoadingMeta(true);

        const classes = await fetchPublicClasses();
        const currentClass = classes.find((c) => c._id === classId) || null;
        setClazz(currentClass);

        const subj = await fetchPublicSubjects(classId);
        const currentSubject = subj.find((s) => s._id === subjectId) || null;
        setSubject(currentSubject);

        const chaps = await fetchPublicChapters(subjectId);
        const currentChapter = chaps.find((c) => c._id === chapterId) || null;
        setChapter(currentChapter);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapter information.");
      } finally {
        setLoadingMeta(false);
      }
    };

    const loadContent = async () => {
      try {
        setLoadingContent(true);
        const data = await fetchPublicContent(chapterId);
        setContent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setLoadingContent(false);
      }
    };

    loadMeta();
    loadContent();
  }, [classId, subjectId, chapterId]);

  const breadcrumbTitle = () => {
    const parts = [];
    if (clazz) parts.push(clazz.name);
    if (subject) parts.push(subject.name);
    if (chapter) parts.push(chapter.title);
    const typeLabel = contentTypeLabel(contentType);
    if (typeLabel) parts.push(typeLabel);
    return parts.join(" › ");
  };

  const items = (() => {
    if (!content) return [];
    switch (contentType) {
      case "lectures":
        return content.lectures || [];
      case "notes":
        return content.notes || [];
      case "tests":
        return content.tests || [];
      case "books":
        return content.books || [];
      default:
        return [];
    }
  })();

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

        <h1 className="course-title">
          {breadcrumbTitle()} – {items.length} item
          {items.length !== 1 ? "s" : ""}
        </h1>

        {error && <p className="courses-error">{error}</p>}
        {loadingMeta && <p>Loading details...</p>}
        {loadingContent && <p>Loading content...</p>}

        {!loadingContent && items.length === 0 && !error && (
          <p className="muted">
            No {contentTypeLabel(contentType).toLowerCase()} available for this
            chapter yet.
          </p>
        )}

        {!loadingContent && items.length > 0 && (
          <ContentCards type={contentType} items={items} />
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

/**
 * Extracts a YouTube video ID from a standard URL.
 */
function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.replace("/", "");
    }
    if (
      u.hostname === "www.youtube.com" ||
      u.hostname === "youtube.com" ||
      u.hostname === "m.youtube.com"
    ) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      return parts.pop() || parts.pop();
    }
  } catch (e) {
    // ignore invalid URL
  }
  return null;
}

function ContentCards({ type, items }) {
  const isVideoType = type === "lectures";

  // ✅ Sort items so oldest (first added) comes first
  const sortedItems = [...items].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt) - new Date(b.createdAt); // ascending
    }
    return 0; // if createdAt not present, keep original order
  });

  return (
    <section className="content-group-card content-group-card--full">
      <div className="courses-grid content-items-grid">
        {sortedItems.map((item) => {
          const youtubeId = isVideoType ? getYouTubeId(item.youtubeUrl) : null;
          const thumbnailUrl = youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            : null;

          return (
            <article className="course-card content-item-card" key={item._id}>
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

                <div className="content-links">
                  {item.youtubeUrl && (
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="content-link"
                    >
                      Watch Video
                    </a>
                  )}
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="content-link"
                    >
                      Open File
                    </a>
                  )}
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="content-link"
                    >
                      Open Link
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

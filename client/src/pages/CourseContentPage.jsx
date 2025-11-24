// client/src/pages/CourseContentPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/course.css";
import {
  fetchPublicClasses,
  fetchPublicSubjects,
  fetchPublicChapters,
  fetchPublicContent,
} from "../api/courseApi";

export default function CourseContentPage() {
  const { classId } = useParams();

  const [clazz, setClazz] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [content, setContent] = useState(null);

  const [error, setError] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  // Load the class info + subjects
  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const classes = await fetchPublicClasses();
        const current = classes.find((c) => c._id === classId) || null;
        setClazz(current || null);

        setLoadingSubjects(true);
        const subj = await fetchPublicSubjects(classId);
        setSubjects(subj);
        if (subj.length > 0) {
          setSelectedSubject(subj[0]._id);
        } else {
          setSelectedSubject("");
          setChapters([]);
          setContent(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course data.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    load();
  }, [classId]);

  // When subject changes, load chapters
  useEffect(() => {
    const loadChapters = async () => {
      if (!selectedSubject) {
        setChapters([]);
        setSelectedChapter("");
        setContent(null);
        return;
      }
      try {
        setLoadingChapters(true);
        const chaps = await fetchPublicChapters(selectedSubject);
        setChapters(chaps);
        if (chaps.length > 0) {
          setSelectedChapter(chaps[0]._id);
        } else {
          setSelectedChapter("");
          setContent(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load chapters.");
      } finally {
        setLoadingChapters(false);
      }
    };

    loadChapters();
  }, [selectedSubject]);

  // When chapter changes, load content
  useEffect(() => {
    const loadContent = async () => {
      if (!selectedChapter) {
        setContent(null);
        return;
      }
      try {
        setLoadingContent(true);
        const data = await fetchPublicContent(selectedChapter);
        setContent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setLoadingContent(false);
      }
    };

    loadContent();
  }, [selectedChapter]);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1>{clazz ? clazz.name : "Course"}</h1>
        {clazz?.description && (
          <p className="courses-subtitle">{clazz.description}</p>
        )}

        {error && <p className="courses-error">{error}</p>}

        {/* Subject + chapter selection */}
        <div className="course-filters">
          <div>
            <label>Subject</label>
            {loadingSubjects ? (
              <p>Loading subjects...</p>
            ) : (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
                {subjects.length === 0 && (
                  <option value="">No subjects</option>
                )}
              </select>
            )}
          </div>

          <div>
            <label>Chapter</label>
            {loadingChapters ? (
              <p>Loading chapters...</p>
            ) : (
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                {chapters.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.chapterNumber
                      ? `${c.chapterNumber}. ${c.title}`
                      : c.title}
                  </option>
                ))}
                {chapters.length === 0 && (
                  <option value="">No chapters</option>
                )}
              </select>
            )}
          </div>
        </div>

        {/* Content lists */}
        {loadingContent && <p>Loading content...</p>}

        {content && !loadingContent && (
          <div className="course-content-grid">
            <ContentGroup title="Lectures" items={content.lectures} />
            <ContentGroup title="Notes" items={content.notes} />
            <ContentGroup title="Tests" items={content.tests} />
            <ContentGroup title="Books" items={content.books} />
          </div>
        )}

        {!loadingContent && !content && (
          <p>Select a chapter to see available content.</p>
        )}
      </div>
    </section>
  );
}

function ContentGroup({ title, items }) {
  return (
    <div className="course-content-column">
      <h3>{title}</h3>
      {(!items || items.length === 0) && <p>No {title.toLowerCase()} yet.</p>}
      <ul>
        {items?.map((item) => (
          <li key={item._id}>
            <strong>{item.title}</strong>
            {item.description && <p>{item.description}</p>}
            {item.youtubeUrl && (
              <a href={item.youtubeUrl} target="_blank" rel="noreferrer">
                Watch video
              </a>
            )}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noreferrer">
                Open file
              </a>
            )}
            {item.externalUrl && (
              <a href={item.externalUrl} target="_blank" rel="noreferrer">
                Open link
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

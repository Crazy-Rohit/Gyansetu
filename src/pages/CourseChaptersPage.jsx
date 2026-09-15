// client/src/pages/CourseChaptersPage.jsx
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import {
  getClassById,
  getSubjectById,
  getChaptersBySubject,
} from "../data/coursesData";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

export default function CourseChaptersPage() {
  const { classId, subjectId } = useParams();

  const clazz = getClassById(classId);
  const subject = getSubjectById(classId, subjectId);
  const chapters = getChaptersBySubject(classId, subjectId);

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

        {chapters.length === 0 && (
          <p className="muted">No chapters added for this subject yet.</p>
        )}

        <Reveal className="courses-grid">
          {chapters.map((chapter) => (
            <TiltCard
              as={Link}
              key={chapter.id}
              to={`/courses/${classId}/${subjectId}/${chapter.id}`}
              className="course-card course-card--link"
              intensity={6}
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
            </TiltCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

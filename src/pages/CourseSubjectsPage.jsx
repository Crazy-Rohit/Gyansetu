// client/src/pages/CourseSubjectsPage.jsx
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import { getClassById, getSubjectsByClass } from "../data/coursesData";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

export default function CourseSubjectsPage() {
  const { classId } = useParams();

  const clazz = getClassById(classId);
  const subjects = getSubjectsByClass(classId);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">
          {clazz ? clazz.name : "Class"} – Subjects
        </h1>
        {clazz?.description && (
          <p className="courses-subtitle">{clazz.description}</p>
        )}

        {subjects.length === 0 && (
          <p className="muted">No subjects added for this class yet.</p>
        )}

        <Reveal className="courses-grid">
          {subjects.map((subject) => (
            <TiltCard
              as={Link}
              key={subject.id}
              to={`/courses/${classId}/${subject.id}`}
              className="course-card course-card--link"
              intensity={6}
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
            </TiltCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

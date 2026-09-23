// src/pages/FunFactsPage.jsx
import { Link } from "react-router-dom";
import "../styles/course.css";
import { getFunFactWeeks } from "../data/funFactsData";
import Reveal from "../components/Reveal";
import TiltCard from "../components/TiltCard";

export default function FunFactsPage() {
  const weeks = getFunFactWeeks();

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">Fun Facts</h1>
        <p className="courses-subtitle">
          A growing collection of bite-sized Maths facts and mini-lessons — a new batch every
          week. Open one to browse it as slides.
        </p>

        {weeks.length === 0 && <p className="muted">No fun facts added yet.</p>}

        <Reveal className="courses-grid">
          {weeks.map((w, i) => (
            <TiltCard
              as={Link}
              key={w.week}
              to={`/fun-facts/${w.week}`}
              className={`course-card course-card--link ${
                i % 2 === 0 ? "course-card--tint-primary" : "course-card--tint-tertiary"
              }`}
              intensity={6}
            >
              <span className="course-badge">Week {w.week}</span>
              <h2 className="course-card__title">Fun Fact {w.week}</h2>
              <p className="course-card__text">{w.weekTitle}</p>
              <p className="course-card__text">{w.cardCount} facts</p>
              <span className="course-card__cta">View Slides</span>
            </TiltCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

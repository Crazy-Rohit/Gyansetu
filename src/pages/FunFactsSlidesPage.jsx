// src/pages/FunFactsSlidesPage.jsx
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import "../styles/funFacts.css";
import { getFunFactWeeks, getFunFactsByWeek } from "../data/funFactsData";
import FunFactsSlideViewer from "../components/FunFactsSlideViewer";

export default function FunFactsSlidesPage() {
  const { week } = useParams();
  const weekMeta = getFunFactWeeks().find((w) => String(w.week) === week);
  const facts = getFunFactsByWeek(week);

  return (
    <section className="courses-page fun-facts-slides-page">
      <div className="gs-container">
        <nav className="breadcrumb">
          <Link to="/fun-facts" className="breadcrumb-link">
            Fun Facts
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">
            {weekMeta ? `Fun Fact ${weekMeta.week}` : "Week"}
          </span>
        </nav>

        <h1 className="course-title">{weekMeta ? weekMeta.weekTitle : "Fun Fact"}</h1>
        {weekMeta && (
          <p className="courses-subtitle">
            {weekMeta.cardCount} facts — pick one from the list, use the arrows, or the arrow
            keys to move through them.
          </p>
        )}

        {facts.length === 0 ? (
          <p className="muted">This week hasn't been added yet.</p>
        ) : (
          <FunFactsSlideViewer facts={facts} />
        )}
      </div>
    </section>
  );
}

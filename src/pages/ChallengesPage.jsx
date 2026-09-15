// client/src/pages/ChallengesPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/course.css";
import "../styles/quiz.css";
import { getChallenges } from "../data/challengeData";
import { getChallengeProgress } from "../utils/challengeProgress";
import ComingSoon from "../components/ComingSoon";

const TABS = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export default function ChallengesPage() {
  const [cadence, setCadence] = useState("weekly");
  const challenges = getChallenges(cadence);
  const active = challenges.find((c) => c.active);
  const past = challenges.filter((c) => !c.active);

  return (
    <section className="courses-page">
      <div className="gs-container">
        <h1 className="course-title">Challenges</h1>
        <p className="courses-subtitle">
          A new quiz every week and every month — separate from your chapter quizzes, open to
          everyone, and worth its own badges.
        </p>

        <div className="filter-chips">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`filter-chip ${cadence === tab.key ? "filter-chip--active" : ""}`}
              onClick={() => setCadence(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active ? (
          <ChallengeFeatureCard cadence={cadence} challenge={active} />
        ) : (
          <ComingSoon
            title={`No Active ${cadence === "weekly" ? "Weekly" : "Monthly"} Challenge`}
            text={`We haven't published a ${cadence} challenge yet — check back soon for a fresh 5-level quiz.`}
          />
        )}

        {past.length > 0 && (
          <>
            <h2 className="course-title" style={{ fontSize: "1.3rem", marginTop: "2rem" }}>
              Past {cadence === "weekly" ? "Weekly" : "Monthly"} Challenges
            </h2>
            <div className="courses-grid">
              {past.map((challenge) => (
                <ChallengeCard key={challenge.id} cadence={cadence} challenge={challenge} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ChallengeFeatureCard({ cadence, challenge }) {
  const progress = getChallengeProgress(cadence, challenge.id);
  const total = challenge.levels.length;
  const passed = progress.passedLevels.length;
  const hasStarted = passed > 0;
  const allPassed = total > 0 && passed === total;

  return (
    <Link to={`/challenges/${cadence}/${challenge.id}/quiz`} className="quiz-feature-card" style={{ marginTop: "1.5rem" }}>
      <span className="quiz-feature-card__icon material-symbols-outlined">emoji_events</span>
      <h2 className="quiz-feature-card__title">{challenge.title}</h2>
      <p className="quiz-feature-card__text">{challenge.description}</p>
      <span className="gs-btn quiz-feature-card__cta">
        {allPassed ? "Review Levels" : hasStarted ? "Continue Challenge" : "Start Challenge"}
        <span className="material-symbols-outlined">arrow_forward</span>
      </span>
    </Link>
  );
}

function ChallengeCard({ cadence, challenge }) {
  return (
    <Link to={`/challenges/${cadence}/${challenge.id}/quiz`} className="course-card course-card--link">
      <span className="course-badge">{cadence === "weekly" ? "Weekly" : "Monthly"}</span>
      <h2 className="course-card__title">{challenge.title}</h2>
      <p className="course-card__text">{challenge.description}</p>
      <span className="course-card__cta">Play Challenge</span>
    </Link>
  );
}

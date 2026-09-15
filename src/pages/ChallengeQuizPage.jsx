// client/src/pages/ChallengeQuizPage.jsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/course.css";
import "../styles/quiz.css";
import "../styles/quizThemes.css";
import { getChallengeById } from "../data/challengeData";
import { getChallengeProgress, recordChallengeLevelResult } from "../utils/challengeProgress";
import { getChallengeQuizTheme } from "../utils/quizTheme";
import QuizRunner from "../components/QuizRunner";
import ComingSoon from "../components/ComingSoon";

export default function ChallengeQuizPage() {
  const { cadence, challengeId } = useParams();
  const challenge = getChallengeById(cadence, challengeId);
  const [progress] = useState(() => getChallengeProgress(cadence, challengeId));

  return (
    <section className={`courses-page ${getChallengeQuizTheme(cadence, challengeId)}`}>
      <div className="gs-container">
        <nav className="breadcrumb">
          <Link to="/challenges" className="breadcrumb-link">
            Challenges
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{challenge ? challenge.title : "Quiz"}</span>
        </nav>

        {!challenge ? (
          <ComingSoon
            icon="search_off"
            title="Challenge Not Found"
            text="This challenge isn't available anymore — check the Challenges page for the current Weekly and Monthly quiz."
            cta={
              <Link to="/challenges" className="gs-btn quiz-btn-secondary">
                Back to Challenges
              </Link>
            }
          />
        ) : (
          <QuizRunner
            quiz={challenge}
            progress={progress}
            badgeIdBase={`challenge-${cadence}-${challengeId}`}
            badgesLinkTo="/my-badges"
            onFinishLevel={(level, outcome) =>
              recordChallengeLevelResult(cadence, challengeId, level, outcome)
            }
          />
        )}
      </div>
    </section>
  );
}

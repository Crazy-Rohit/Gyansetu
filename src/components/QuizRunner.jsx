// client/src/components/QuizRunner.jsx
// The reusable quiz-playing engine (level map -> mode select -> question
// runner -> result) shared by the per-chapter Quiz page and the
// Weekly/Monthly Challenge quiz page. The caller owns where progress is
// persisted (quizProgress.js vs challengeProgress.js) via `onFinishLevel`,
// and owns navigation/breadcrumbs.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/quiz.css";
import { isLevelUnlocked } from "../utils/quizProgress";
import { fireConfetti, isCorrectAnswer, shuffleArray, timeLimitFor } from "../utils/quiz";
import { getCheckpoint } from "../data/checkpoints";
import logo from "../assets/images/gyansetu-logo.webp";

// Lazy-loaded: pulls in three.js only once a student actually opens a badge.
const BadgeDownloadModal = lazy(() => import("./BadgeDownloadModal"));

export default function QuizRunner({
  quiz,
  progress,
  onFinishLevel,
  badgeIdBase,
  badgesLinkTo = "/my-badges",
}) {
  const [localProgress, setLocalProgress] = useState(progress);

  // "intro" | "mode" | "question" | "result"
  const [phase, setPhase] = useState("intro");
  const [pendingLevel, setPendingLevel] = useState(null);
  const [isTimed, setIsTimed] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);
  const [levelQuestions, setLevelQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct, correctAnswer }
  const [typedValue, setTypedValue] = useState("");
  const [result, setResult] = useState(null); // { scorePercent, correctCount, total, earnedMarks, totalMarks, passed, elapsedSeconds }

  const timerRef = useRef(null);
  const answersRef = useRef([]);
  const levelStartRef = useRef(null);
  const particleContainerRef = useRef(null);

  const currentQuestion = levelQuestions[currentIndex];

  // Countdown timer — resets every time the current question changes.
  // Skipped entirely in untimed mode (question just waits for an answer).
  useEffect(() => {
    if (phase !== "question" || !currentQuestion) return;

    setLocked(false);
    setFeedback(null);
    setTypedValue("");

    if (!isTimed) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(timeLimitFor(currentQuestion));

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex, levelQuestions, isTimed]);

  function requestStart(levelNumber) {
    setPendingLevel(levelNumber);
    setPhase("mode");
  }

  function startLevel(levelNumber, timed) {
    const levelData = quiz.levels.find((l) => l.level === levelNumber);
    if (!levelData) return;

    const shuffledQuestions = shuffleArray(levelData.questions).map((q) =>
      q.type === "mcq" ? { ...q, options: shuffleArray(q.options) } : q
    );

    answersRef.current = [];
    levelStartRef.current = Date.now();
    setIsTimed(timed);
    setActiveLevel(levelNumber);
    setLevelQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setResult(null);
    setPhase("question");
  }

  function submitAnswer(userInput) {
    if (locked || !currentQuestion) return;
    clearInterval(timerRef.current);

    const correct = isCorrectAnswer(currentQuestion, userInput);
    answersRef.current.push({ correct, marks: currentQuestion.marks || 1 });
    setLocked(true);
    setFeedback({ correct, correctAnswer: currentQuestion.correctAnswer });

    if (correct) {
      fireConfetti(particleContainerRef.current);
    }

    setTimeout(() => {
      const isLastQuestion = currentIndex + 1 >= levelQuestions.length;
      if (isLastQuestion) {
        finishLevel(answersRef.current);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1400);
  }

  function finishLevel(answers) {
    const total = answers.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const totalMarks = answers.reduce((sum, a) => sum + a.marks, 0);
    const earnedMarks = answers.filter((a) => a.correct).reduce((sum, a) => sum + a.marks, 0);
    const scorePercent = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const levelData = quiz.levels.find((l) => l.level === activeLevel);
    const passed = scorePercent >= (levelData.passPercent ?? 60);
    const badgeId = `${badgeIdBase}-level-${activeLevel}`;
    const elapsedSeconds = levelStartRef.current
      ? Math.round((Date.now() - levelStartRef.current) / 1000)
      : 0;

    const updated = onFinishLevel(activeLevel, { passed, scorePercent, badgeId });

    setLocalProgress(updated);
    setResult({ scorePercent, correctCount, total, earnedMarks, totalMarks, passed, elapsedSeconds });
    setPhase("result");
  }

  function backToLevels() {
    setPhase("intro");
    setActiveLevel(null);
    setPendingLevel(null);
  }

  return (
    <div>
      {phase === "intro" && (
        <LevelSelect
          quiz={quiz}
          progress={localProgress}
          onStart={requestStart}
          badgesLinkTo={badgesLinkTo}
        />
      )}

      {phase === "mode" && pendingLevel != null && (
        <ModeSelect
          quiz={quiz}
          level={pendingLevel}
          onChoose={(timed) => startLevel(pendingLevel, timed)}
          onCancel={backToLevels}
        />
      )}

      {phase === "question" && currentQuestion && (
        <QuestionRunner
          question={currentQuestion}
          index={currentIndex}
          total={levelQuestions.length}
          level={activeLevel}
          isTimed={isTimed}
          timeLeft={timeLeft}
          locked={locked}
          feedback={feedback}
          typedValue={typedValue}
          onTypedChange={setTypedValue}
          onSubmit={submitAnswer}
        />
      )}

      {phase === "result" && result && (
        <LevelResult
          level={activeLevel}
          result={result}
          isLastLevel={activeLevel === quiz.levels.length}
          onRetry={() => requestStart(activeLevel)}
          onContinue={() => requestStart(activeLevel + 1)}
          onBackToLevels={backToLevels}
          particleContainerRef={particleContainerRef}
        />
      )}

      <div className="quiz-particle-container" ref={particleContainerRef} />
    </div>
  );
}

function LevelSelect({ quiz, progress, onStart, badgesLinkTo }) {
  const total = quiz.levels.length;
  const passedCount = progress.passedLevels.length;
  const allPassed = passedCount === total;
  const overallPct = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  return (
    <div>
      <header className="quiz-map-header">
        <div className="quiz-map-header__intro">
          <img src={logo} alt="" className="quiz-map-header__icon" />
          <div>
            <h1 className="quiz-map-header__title">{quiz.title}</h1>
            <p className="quiz-map-header__text">
              {total} levels, each with its own timer per question. Pass a level to unlock the
              next one and earn its badge.
            </p>
          </div>
        </div>
        <div className="quiz-map-header__progress">
          <span className="quiz-map-header__progress-label">Overall Progress</span>
          <div className="quiz-map-header__progress-row">
            <span className="quiz-map-header__progress-value">{overallPct}%</span>
            <div className="quiz-map-header__progress-bar">
              <div
                className="quiz-map-header__progress-fill"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {allPassed && (
        <div className="quiz-complete-banner">
          <span className="material-symbols-outlined">workspace_premium</span>
          <div>
            <strong>Incredible! You've mastered this quiz.</strong>
            <p>All {total} levels completed. Check your badges below!</p>
          </div>
          <Link to={badgesLinkTo} className="gs-btn quiz-complete-banner__cta">
            View Badges
          </Link>
        </div>
      )}

      <LevelMap quiz={quiz} progress={progress} onStart={onStart} />

      <p className="muted small quiz-badges-link">
        <Link to={badgesLinkTo}>See all my badges →</Link>
      </p>
    </div>
  );
}

function LevelMap({ quiz, progress, onStart }) {
  const pathRef = useRef(null);
  const total = quiz.levels.length;
  const passedCount = progress.passedLevels.length;

  const nodes = quiz.levels.map((level, i) => {
    const x = total > 1 ? (i / (total - 1)) * 80 + 10 : 50;
    const isTop = i % 2 === 1;
    const passed = progress.passedLevels.includes(level.level);
    const unlocked = isLevelUnlocked(progress, level.level);
    const isCurrent = unlocked && !passed;
    const isBoss = i === total - 1 && total > 1;
    return { level, x, isTop, passed, unlocked, isCurrent, isBoss };
  });

  // Build a winding SVG path (viewBox 0 0 1000 400) through the node centers.
  const svgY = (isTop) => (isTop ? 90 : 310);
  const points = nodes.map((n) => ({ x: n.x * 10, y: svgY(n.isTop) }));
  const pathD = points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midX = (prev.x + p.x) / 2;
    return `${d} C ${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    const frac = total > 1 ? passedCount / (total - 1) : passedCount > 0 ? 1 : 0;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length * (1 - Math.min(frac, 1)));
  }, [total, passedCount]);

  return (
    <div className="quiz-map">
      <svg className="quiz-map__path-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
        <path d={pathD} className="quiz-map__path-track" fill="none" />
        <path ref={pathRef} d={pathD} className="quiz-map__path-fill" fill="none" />
      </svg>

      <div className="quiz-map__nodes">
        {nodes.map(({ level, x, isTop, passed, unlocked, isCurrent, isBoss }) => {
          const checkpoint = getCheckpoint(level.level);
          return (
            <div
              key={level.level}
              className={`quiz-map__node ${isTop ? "quiz-map__node--top" : "quiz-map__node--bottom"}`}
              style={{ "--node-left": `${x}%` }}
            >
              {isCurrent && <span className="quiz-map__pulse" aria-hidden="true" />}

              <button
                type="button"
                className={`quiz-map__node-btn checkpoint-tone--${checkpoint?.tone || "olive"}
                  ${passed ? "quiz-map__node-btn--passed" : ""}
                  ${isCurrent ? "quiz-map__node-btn--current" : ""}
                  ${!unlocked && isBoss ? "quiz-map__node-btn--boss" : ""}`}
                disabled={!unlocked}
                onClick={() => onStart(level.level)}
                title={
                  passed && typeof progress.bestScores[level.level] === "number"
                    ? `Best score: ${progress.bestScores[level.level]}% · ${checkpoint?.description || ""}`
                    : checkpoint?.description
                }
              >
                <span className="material-symbols-outlined">{checkpoint?.icon || "star"}</span>
                {passed && (
                  <span className="quiz-map__node-check material-symbols-outlined">check</span>
                )}
                {!unlocked && (
                  <span className="quiz-map__node-lock material-symbols-outlined">lock</span>
                )}
              </button>

              <span className="quiz-map__node-label">
                <span className="quiz-map__node-eyebrow">Checkpoint {level.level}</span>
                <span className="quiz-map__node-title">
                  {checkpoint?.title || level.label || `Level ${level.level}`}
                </span>
              </span>
              {isCurrent && <span className="quiz-map__node-current">Current</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModeSelect({ quiz, level, onChoose, onCancel }) {
  const levelData = quiz.levels.find((l) => l.level === level);
  const checkpoint = getCheckpoint(level);
  const questionCount = levelData?.questions.length || 0;

  return (
    <div className="mode-select">
      <button type="button" className="mode-select__back" onClick={onCancel}>
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Levels
      </button>

      <h2 className="mode-select__title">
        Checkpoint {level} · {checkpoint?.title}
      </h2>
      <p className="mode-select__text">
        {questionCount} question{questionCount !== 1 ? "s" : ""}. How would you like to play?
      </p>

      <div className="mode-select__options">
        <button type="button" className="mode-option" onClick={() => onChoose(true)}>
          <span className="mode-option__icon material-symbols-outlined">timer</span>
          <span className="mode-option__title">Timed</span>
          <span className="mode-option__text">
            Every question has its own countdown — the real quiz challenge.
          </span>
        </button>

        <button type="button" className="mode-option" onClick={() => onChoose(false)}>
          <span className="mode-option__icon material-symbols-outlined">all_inclusive</span>
          <span className="mode-option__title">Untimed</span>
          <span className="mode-option__text">
            No countdown — take as long as you need on each question.
          </span>
        </button>
      </div>
    </div>
  );
}

function QuestionRunner({
  question,
  index,
  total,
  level,
  isTimed,
  timeLeft,
  locked,
  feedback,
  typedValue,
  onTypedChange,
  onSubmit,
}) {
  const limit = timeLimitFor(question);
  const pct = Math.max(0, Math.min(100, (timeLeft / limit) * 100));
  const urgent = isTimed && timeLeft <= 5;

  return (
    <div className="quiz-question-wrap">
      <div className="quiz-question-card__header">
        <span className="quiz-question-card__progress">
          Level {level} <span className="quiz-question-card__dot">•</span> Question {index + 1} of {total}
        </span>
        {isTimed ? (
          <span className={`quiz-question-card__timer ${urgent ? "quiz-question-card__timer--urgent" : ""}`}>
            {timeLeft}s
          </span>
        ) : (
          <span className="quiz-question-card__untimed">
            <span className="material-symbols-outlined">all_inclusive</span>
            Untimed
          </span>
        )}
      </div>

      {isTimed && (
        <div className="quiz-timer-bar">
          <div
            className={`quiz-timer-bar__fill ${urgent ? "quiz-timer-bar__fill--urgent" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="quiz-question-card">
        <div className="quiz-question-card__top">
          <h2 className="quiz-question-card__question">{question.question}</h2>
          {question.marks && (
            <span className="quiz-question-card__marks">
              {"★".repeat(question.marks)} {question.marks} Mark{question.marks !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {question.imageUrl && (
          <div className="quiz-question-card__diagram">
            <img src={question.imageUrl} alt="" />
          </div>
        )}

        {question.type === "mcq" ? (
          <div className="quiz-options">
            {question.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const isCorrectOption =
                feedback && option.trim().toLowerCase() === feedback.correctAnswer.trim().toLowerCase();
              const isWrongSelected = feedback && !feedback.correct && !isCorrectOption;
              return (
                <button
                  type="button"
                  key={option}
                  className={`quiz-option ${
                    feedback && isCorrectOption ? "quiz-option--correct" : ""
                  } ${feedback && !isCorrectOption && !isWrongSelected ? "quiz-option--dimmed" : ""}`}
                  disabled={locked}
                  onClick={() => onSubmit(option)}
                >
                  <span className="quiz-option__letter">{letter}</span>
                  <span className="quiz-option__text">{option}</span>
                  {feedback && isCorrectOption && (
                    <span className="material-symbols-outlined quiz-option__check">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form
            className="quiz-typed-form"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(typedValue);
            }}
          >
            <input
              type="text"
              className="profile-modal__input quiz-typed-form__input"
              value={typedValue}
              onChange={(e) => onTypedChange(e.target.value)}
              disabled={locked}
              placeholder="Type your answer"
              autoFocus
            />
            <button type="submit" className="gs-btn" disabled={locked || !typedValue.trim()}>
              Submit
            </button>
          </form>
        )}

        {feedback && (
          <p className={`quiz-feedback ${feedback.correct ? "quiz-feedback--correct" : "quiz-feedback--wrong"}`}>
            {feedback.correct ? "Correct!" : `Correct answer: ${feedback.correctAnswer}`}
          </p>
        )}
      </div>
    </div>
  );
}

function LevelResult({ level, result, isLastLevel, onRetry, onContinue, onBackToLevels, particleContainerRef }) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (result.passed) {
      const timeout = setTimeout(() => fireConfetti(particleContainerRef.current), 500);
      return () => clearTimeout(timeout);
    }
  }, [result.passed, particleContainerRef]);

  const minutes = Math.floor(result.elapsedSeconds / 60);
  const seconds = result.elapsedSeconds % 60;
  const checkpoint = getCheckpoint(level);

  return (
    <div className="quiz-result-card">
      <div
        className={`quiz-result-card__medal ${
          result.passed ? `checkpoint-tone--${checkpoint?.tone || "platinum"}` : ""
        }`}
      >
        <span className="material-symbols-outlined">
          {result.passed ? checkpoint?.icon || "stars" : "sentiment_neutral"}
        </span>
      </div>

      <h2 className="quiz-result-card__title">
        {result.passed ? "🎉 Level Passed!" : "Not quite — try again"}
      </h2>
      <p className="quiz-result-card__score">
        {result.correctCount}/{result.total} correct · {result.earnedMarks}/{result.totalMarks} marks (
        {result.scorePercent}%)
      </p>

      <div className="quiz-result-card__chips">
        <span className="quiz-result-card__chip">
          <span className="material-symbols-outlined">timer</span>
          Time: {minutes}:{String(seconds).padStart(2, "0")}
        </span>
        {result.passed && checkpoint && (
          <span className="quiz-result-card__chip quiz-result-card__chip--badge">
            <span className="material-symbols-outlined">workspace_premium</span>
            "{checkpoint.title}" badge earned!
          </span>
        )}
      </div>

      {result.passed && checkpoint && (
        <>
          <p className="quiz-result-card__checkpoint-desc">{checkpoint.description}</p>
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={() => setShowBadge(true)}>
            <span className="material-symbols-outlined">view_in_ar</span>
            View &amp; Download Badge
          </button>
        </>
      )}

      {showBadge && checkpoint && (
        <Suspense fallback={null}>
          <BadgeDownloadModal
            tone={checkpoint.tone}
            icon={checkpoint.icon}
            title={checkpoint.title}
            onClose={() => setShowBadge(false)}
          />
        </Suspense>
      )}

      <div className="quiz-result-card__actions">
        {!result.passed && (
          <button type="button" className="gs-btn quiz-result-card__primary" onClick={onRetry}>
            Try Again
          </button>
        )}
        {result.passed && !isLastLevel && (
          <button type="button" className="gs-btn quiz-result-card__primary" onClick={onContinue}>
            Continue to Level {level + 1}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        )}
        {result.passed && isLastLevel && (
          <p className="quiz-complete-banner quiz-complete-banner--inline">
            🎉 You've completed all levels of this quiz!
          </p>
        )}

        <div className="quiz-result-card__secondary-row">
          {result.passed && (
            <button type="button" className="gs-btn quiz-btn-secondary" onClick={onRetry}>
              <span className="material-symbols-outlined">refresh</span>
              Retry
            </button>
          )}
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={onBackToLevels}>
            <span className="material-symbols-outlined">home</span>
            Back to Levels
          </button>
        </div>
      </div>
    </div>
  );
}

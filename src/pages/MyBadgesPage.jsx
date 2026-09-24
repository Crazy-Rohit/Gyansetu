// client/src/pages/MyBadgesPage.jsx
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/course.css";
import "../styles/quiz.css";
import { getClassById, getSubjectById, getChapterById } from "../data/coursesData";
import { getChallengeById } from "../data/challengeData";
import { getCheckpoint } from "../data/checkpoints";
import { getAllBadges } from "../utils/quizProgress";
import { getAllChallengeBadges } from "../utils/challengeProgress";
import { useUserProfile } from "../hooks/useUserProfile";

// Lazy-loaded: pulls in three.js only once a student actually opens a badge.
const BadgeDownloadModal = lazy(() => import("../components/BadgeDownloadModal"));

const SOURCE_FILTERS = [
  { key: "all", label: "All" },
  { key: "class-9", label: "Class 9" },
  { key: "class-10", label: "Class 10" },
  { key: "challenges", label: "Challenges" },
];

export default function MyBadgesPage() {
  const { profile } = useUserProfile();
  const chapterBadges = getAllBadges();
  const challengeBadges = getAllChallengeBadges();
  const totalBadges = chapterBadges.length + challengeBadges.length;
  const [viewingBadge, setViewingBadge] = useState(null); // { tone, icon, title } | null

  const [source, setSource] = useState("all"); // "all" | "class-9" | "class-10" | "challenges"
  const [chapterKey, setChapterKey] = useState("all"); // "all" | `${classId}/${chapterId}`

  // Only chapters that actually have an earned badge get a chip — no point
  // offering a filter for a chapter the student hasn't touched yet.
  const chapterOptions = useMemo(() => {
    if (source !== "class-9" && source !== "class-10") return [];
    const seen = new Map();
    for (const badge of chapterBadges) {
      if (badge.classId !== source) continue;
      const key = `${badge.classId}/${badge.chapterId}`;
      if (!seen.has(key)) {
        const chapter = getChapterById(badge.classId, badge.subjectId, badge.chapterId);
        seen.set(key, {
          key,
          label: chapter?.title || badge.chapterId,
          number: chapter?.chapterNumber ?? 99,
        });
      }
    }
    return [...seen.values()].sort((a, b) => a.number - b.number);
  }, [chapterBadges, source]);

  const visibleChapterBadges = chapterBadges.filter((badge) => {
    if (source === "challenges") return false;
    if (source !== "all" && badge.classId !== source) return false;
    if (chapterKey !== "all" && `${badge.classId}/${badge.chapterId}` !== chapterKey) return false;
    return true;
  });

  const visibleChallengeBadges =
    source === "all" || source === "challenges" ? challengeBadges : [];

  const visibleTotal = visibleChapterBadges.length + visibleChallengeBadges.length;
  const isFiltered = source !== "all" || chapterKey !== "all";

  const selectSource = (key) => {
    setSource(key);
    setChapterKey("all"); // changing the class/source always resets the chapter chip
  };

  return (
    <section className="courses-page">
      <div className="gs-container">
        <header className="badges-hero">
          <span className="badges-hero__avatar">{profile?.avatar || "🏆"}</span>
          <div className="badges-hero__info">
            <h1 className="course-title">
              {profile ? `${profile.name}'s Trophy Room` : "Trophy Room"}
            </h1>
            <p className="courses-subtitle">
              Every level you pass in a chapter quiz or a Challenge earns a badge here. They're
              stored on this browser only — no account needed.
            </p>
          </div>
          <div className="badges-hero__stat">
            <span className="material-symbols-outlined">workspace_premium</span>
            <div>
              <span className="badges-hero__stat-value">{totalBadges}</span>
              <span className="badges-hero__stat-label">Badges Earned</span>
            </div>
          </div>
        </header>

        {totalBadges === 0 ? (
          <p className="muted">
            No badges yet — head over to a chapter's Quiz (or a Challenge) and pass Level 1 to
            earn your first one. <Link to="/courses">Browse courses →</Link>
          </p>
        ) : (
          <>
            <div className="filter-chips" role="tablist" aria-label="Filter badges by class">
              {SOURCE_FILTERS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={source === tab.key}
                  className={`filter-chip ${source === tab.key ? "filter-chip--active" : ""}`}
                  onClick={() => selectSource(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {chapterOptions.length > 0 && (
              <div className="filter-chips" role="tablist" aria-label="Filter badges by chapter">
                <button
                  type="button"
                  role="tab"
                  aria-selected={chapterKey === "all"}
                  className={`filter-chip ${chapterKey === "all" ? "filter-chip--active" : ""}`}
                  onClick={() => setChapterKey("all")}
                >
                  All chapters
                </button>
                {chapterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="tab"
                    aria-selected={chapterKey === opt.key}
                    className={`filter-chip ${chapterKey === opt.key ? "filter-chip--active" : ""}`}
                    onClick={() => setChapterKey(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {visibleTotal === 0 ? (
              <p className="muted">No badges match this filter yet.</p>
            ) : (
              <div className="badges-grid">
                {visibleChapterBadges.map((badge) => {
                  const clazz = getClassById(badge.classId);
                  const subject = getSubjectById(badge.classId, badge.subjectId);
                  const chapter = getChapterById(badge.classId, badge.subjectId, badge.chapterId);
                  const checkpoint = getCheckpoint(badge.level);

                  return (
                    <div key={badge.badgeId} className="badge-card">
                      <span
                        className={`badge-card__icon material-symbols-outlined checkpoint-tone--${checkpoint?.tone || "olive"}`}
                      >
                        {checkpoint?.icon || "workspace_premium"}
                      </span>
                      <h3 className="badge-card__title">{checkpoint?.title || `Level ${badge.level}`}</h3>
                      <p className="badge-card__meta">
                        Checkpoint {badge.level} · {chapter?.title || badge.chapterId}
                      </p>
                      <p className="badge-card__meta badge-card__meta--muted">
                        {clazz?.name} · {subject?.name}
                      </p>
                      {checkpoint && <p className="badge-card__desc">{checkpoint.description}</p>}
                      <div className="badge-card__cta-row">
                        <Link
                          className="gs-btn quiz-btn-secondary badge-card__cta"
                          to={`/courses/${badge.classId}/${badge.subjectId}/${badge.chapterId}/quiz`}
                        >
                          Open Quiz
                        </Link>
                        {checkpoint && (
                          <button
                            type="button"
                            className="gs-btn badge-card__cta"
                            onClick={() => setViewingBadge(checkpoint)}
                          >
                            View Badge
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {visibleChallengeBadges.map((badge) => {
                  const challenge = getChallengeById(badge.cadence, badge.challengeId);
                  const checkpoint = getCheckpoint(badge.level);

                  return (
                    <div key={badge.badgeId} className="badge-card badge-card--challenge">
                      <span
                        className={`badge-card__icon material-symbols-outlined checkpoint-tone--${checkpoint?.tone || "platinum"}`}
                      >
                        {checkpoint?.icon || "emoji_events"}
                      </span>
                      <h3 className="badge-card__title">{checkpoint?.title || `Level ${badge.level}`}</h3>
                      <p className="badge-card__meta">
                        Checkpoint {badge.level} · {challenge?.title || badge.challengeId}
                      </p>
                      <p className="badge-card__meta badge-card__meta--muted">
                        {badge.cadence === "weekly" ? "Weekly Challenge" : "Monthly Challenge"}
                      </p>
                      {checkpoint && <p className="badge-card__desc">{checkpoint.description}</p>}
                      <div className="badge-card__cta-row">
                        <Link
                          className="gs-btn quiz-btn-secondary badge-card__cta"
                          to={`/challenges/${badge.cadence}/${badge.challengeId}/quiz`}
                        >
                          Open Challenge
                        </Link>
                        {checkpoint && (
                          <button
                            type="button"
                            className="gs-btn badge-card__cta"
                            onClick={() => setViewingBadge(checkpoint)}
                          >
                            View Badge
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {isFiltered && (
              <p className="muted small badges-filter-count">
                Showing {visibleTotal} of {totalBadges} badges.
              </p>
            )}
          </>
        )}

        {viewingBadge && (
          <Suspense fallback={null}>
            <BadgeDownloadModal
              tone={viewingBadge.tone}
              icon={viewingBadge.icon}
              title={viewingBadge.title}
              onClose={() => setViewingBadge(null)}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}

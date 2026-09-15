// client/src/utils/challengeProgress.js
// Progress + badges for Weekly/Monthly challenges — kept in a separate
// localStorage key from per-chapter quiz progress (utils/quizProgress.js)
// since challenges aren't part of the class/subject/chapter tree.

const STORAGE_KEY = "gs_challenge_progress";

const EMPTY_PROGRESS = { passedLevels: [], badges: [], bestScores: {} };

function readBlob() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeBlob(blob) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
}

export function getChallengeProgress(cadence, challengeId) {
  const blob = readBlob();
  const entry = blob[cadence]?.[challengeId];
  return entry ? { ...EMPTY_PROGRESS, ...entry } : { ...EMPTY_PROGRESS };
}

export function recordChallengeLevelResult(cadence, challengeId, level, { passed, scorePercent, badgeId }) {
  const blob = readBlob();
  const current = getChallengeProgress(cadence, challengeId);

  const passedLevels = passed && !current.passedLevels.includes(level)
    ? [...current.passedLevels, level].sort((a, b) => a - b)
    : current.passedLevels;

  const badges = passed && badgeId && !current.badges.includes(badgeId)
    ? [...current.badges, badgeId]
    : current.badges;

  const bestScores = {
    ...current.bestScores,
    [level]: Math.max(current.bestScores[level] || 0, scorePercent),
  };

  const updated = { passedLevels, badges, bestScores };

  blob[cadence] = blob[cadence] || {};
  blob[cadence][challengeId] = updated;
  writeBlob(blob);

  return updated;
}

/** Flattens all challenge badges — used alongside getAllBadges() on MyBadgesPage. */
export function getAllChallengeBadges() {
  const blob = readBlob();
  const badges = [];

  for (const cadence of Object.keys(blob)) {
    for (const challengeId of Object.keys(blob[cadence] || {})) {
      const entry = blob[cadence][challengeId];
      (entry.badges || []).forEach((badgeId) => {
        const level = Number(badgeId.split("-level-").pop());
        badges.push({ cadence, challengeId, level, badgeId });
      });
    }
  }

  return badges.sort((a, b) => a.level - b.level);
}

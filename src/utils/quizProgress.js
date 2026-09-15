// client/src/utils/quizProgress.js
// Per-browser quiz progress + badges. No backend/DB — everything lives in
// a single localStorage key, mirroring the classId/subjectId/chapterId
// nesting used by quizData.js.

const STORAGE_KEY = "gs_quiz_progress";

const EMPTY_CHAPTER_PROGRESS = { passedLevels: [], badges: [], bestScores: {} };

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

export function getChapterProgress(classId, subjectId, chapterId) {
  const blob = readBlob();
  const entry = blob[classId]?.[subjectId]?.[chapterId];
  return entry
    ? { passedLevels: [], badges: [], bestScores: {}, ...entry }
    : { ...EMPTY_CHAPTER_PROGRESS };
}

export function isLevelUnlocked(progress, levelNumber) {
  if (levelNumber <= 1) return true;
  return progress.passedLevels.includes(levelNumber - 1);
}

/**
 * Records the outcome of a level attempt. Only ever adds to passedLevels/
 * badges (never removes), and keeps the best score seen for that level.
 * Returns the updated chapter progress.
 */
export function recordLevelResult(classId, subjectId, chapterId, level, { passed, scorePercent, badgeId }) {
  const blob = readBlob();
  const current = getChapterProgress(classId, subjectId, chapterId);

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

  blob[classId] = blob[classId] || {};
  blob[classId][subjectId] = blob[classId][subjectId] || {};
  blob[classId][subjectId][chapterId] = updated;
  writeBlob(blob);

  return updated;
}

/** Flattens the whole progress blob into a list of earned badges. */
export function getAllBadges() {
  const blob = readBlob();
  const badges = [];

  for (const classId of Object.keys(blob)) {
    for (const subjectId of Object.keys(blob[classId] || {})) {
      for (const chapterId of Object.keys(blob[classId][subjectId] || {})) {
        const entry = blob[classId][subjectId][chapterId];
        (entry.badges || []).forEach((badgeId) => {
          const level = Number(badgeId.split("-level-").pop());
          badges.push({ classId, subjectId, chapterId, level, badgeId });
        });
      }
    }
  }

  return badges.sort((a, b) => a.level - b.level);
}

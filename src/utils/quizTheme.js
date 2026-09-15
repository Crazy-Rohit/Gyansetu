// client/src/utils/quizTheme.js
//
// Picks which of the 12 accent variants in src/styles/quizThemes.css a given
// quiz should wear. Every chapter (and every weekly/monthly challenge) gets
// its own look, all still built from the same brand palette structure — see
// quizThemes.css's own header for how the palettes themselves are built.

export const QUIZ_THEME_COUNT = 12;

// The 10 chapters that exist today get a hand-picked, guaranteed-spread-out
// slot rather than a hashed one, so two adjacent chapters (which a student
// moves between in one sitting) are never accidentally close in hue, and a
// chapter's look stays stable even if a later chapter's name changes.
// class-9 takes the even slots, class-10 the odd ones, so "Chapter 1" in
// each class reads as related-but-distinguishable rather than identical.
const CHAPTER_THEME_MAP = {
  "class-9/ch-1": 0, // Meadow — the original, unchanged brand look
  "class-9/ch-2": 2, // Sky Cobalt
  "class-9/ch-3": 4, // Slate Indigo
  "class-9/ch-4": 6, // Moss Olive
  "class-9/ch-5": 8, // Coral Rose

  "class-10/ch-1": 1, // Ocean Teal
  "class-10/ch-2": 3, // Berry Plum
  "class-10/ch-3": 5, // Terracotta
  "class-10/ch-4": 7, // Violet Dusk
  "class-10/ch-5": 9, // Bronze Copper
};

/** Small, deterministic string hash — same key always maps to the same slot. */
function hashToSlot(key, slotCount) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % slotCount;
}

/**
 * Returns the "quiz-theme--N" class for a chapter quiz. Falls back to a
 * deterministic hash of classId/chapterId for any chapter not in the map
 * above (a new chapter added later still gets a stable, distinct look
 * without needing this file updated first).
 */
export function getChapterQuizTheme(classId, chapterId) {
  const key = `${classId}/${chapterId}`;
  const slot = key in CHAPTER_THEME_MAP ? CHAPTER_THEME_MAP[key] : hashToSlot(key, QUIZ_THEME_COUNT);
  return `quiz-theme--${slot}`;
}

/**
 * Returns the "quiz-theme--N" class for a Weekly/Monthly challenge. There's
 * no fixed set of these (a new one launches on a cadence), so it's always
 * hash-based — but the hash includes the cadence so a weekly and a monthly
 * challenge that happen to share an id suffix don't end up matching.
 */
export function getChallengeQuizTheme(cadence, challengeId) {
  const slot = hashToSlot(`${cadence}/${challengeId}`, QUIZ_THEME_COUNT);
  return `quiz-theme--${slot}`;
}

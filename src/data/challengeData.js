// client/src/data/challengeData.js
//
// Weekly/Monthly challenge quizzes — separate from the per-chapter quizzes
// in quizData.js. These aren't tied to any class/subject/chapter; they live
// under their own "Challenges" section and are meant to be swapped out on a
// cadence (a new weekly challenge every week, a new monthly one every month).
//
// Shape reference (same level/question shape as quizData.js):
//
// challenges: {
//   weekly: [ { id, title, description, active, levels: [...] } ],
//   monthly: [ { id, title, description, active, levels: [...] } ],
// }
//
// Only one challenge per cadence should have `active: true` at a time —
// that's the one shown on the Challenges page and the Home page's
// highlighted "This Week's Challenge" card. Past challenges can stay in the
// array with `active: false` so students' history/badges still resolve.

export const challenges = {
  weekly: [
    {
      id: "w1",
      title: "Week 1 Challenge: Number Systems Speed Round",
      description: "A fast-paced 3-level challenge mixing rational/irrational numbers and quick mental math.",
      active: true,
      levels: [
        {
          level: 1,
          label: "Level 1",
          passPercent: 60,
          questions: [
            {
              id: "w1-l1-q1",
              type: "mcq",
              question: "Which of these is a rational number?",
              options: ["√2", "π", "5/2", "√7"],
              correctAnswer: "5/2",
              timeLimitSeconds: 20,
            },
            {
              id: "w1-l1-q2",
              type: "typed",
              question: "What is 9 × 8?",
              correctAnswer: "72",
              timeLimitSeconds: 20,
            },
          ],
        },
        {
          level: 2,
          label: "Level 2",
          passPercent: 60,
          questions: [
            {
              id: "w1-l2-q1",
              type: "typed",
              question: "Find the value of √49.",
              correctAnswer: "7",
              timeLimitSeconds: 20,
            },
            {
              id: "w1-l2-q2",
              type: "mcq",
              question: "Which of these is an irrational number?",
              options: ["0.5", "√3", "3/4", "2"],
              correctAnswer: "√3",
              timeLimitSeconds: 20,
            },
          ],
        },
        {
          level: 3,
          label: "Level 3",
          passPercent: 65,
          questions: [
            {
              id: "w1-l3-q1",
              type: "typed",
              question: "Simplify: 6 × (4 + 3)",
              correctAnswer: "42",
              timeLimitSeconds: 25,
            },
          ],
        },
      ],
    },
  ],
  monthly: [],
};

export function getChallenges(cadence) {
  return challenges[cadence] || [];
}

export function getActiveChallenge(cadence) {
  return getChallenges(cadence).find((c) => c.active) || null;
}

export function getChallengeById(cadence, challengeId) {
  return getChallenges(cadence).find((c) => c.id === challengeId) || null;
}

// client/src/utils/quiz.js
// Answer checking + timer defaults for the quiz feature.

export function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * mcq: exact match (case/whitespace-insensitive) against correctAnswer.
 * typed: exact match against correctAnswer/acceptedAnswers, plus numeric
 * equality when both sides parse as numbers (so "14" and "14.0" both work).
 */
export function isCorrectAnswer(question, userInput) {
  if (userInput == null) return false;
  const given = normalizeAnswer(userInput);
  if (!given) return false;

  if (question.type === "mcq") {
    return given === normalizeAnswer(question.correctAnswer);
  }

  const candidates = [question.correctAnswer, ...(question.acceptedAnswers || [])].map(
    normalizeAnswer
  );
  if (candidates.includes(given)) return true;

  const givenNum = Number(given);
  if (Number.isFinite(givenNum)) {
    return candidates.some((c) => {
      const n = Number(c);
      return Number.isFinite(n) && n === givenNum;
    });
  }
  return false;
}

export function defaultTimeLimit(type) {
  return type === "typed" ? 60 : 30;
}

export function timeLimitFor(question) {
  return question.timeLimitSeconds || defaultTimeLimit(question.type);
}

/** Fisher-Yates shuffle — returns a new array, does not mutate the input. */
export function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const CONFETTI_COLORS = ["#0d631b", "#2e7d32", "#ffb231", "#88d982", "#efbe7c"];

/**
 * Small DOM-particle confetti burst (no library) — spawns short-lived
 * absolutely-positioned dots inside `container` and animates them outward
 * via the Web Animations API, then removes them.
 */
export function fireConfetti(container) {
  if (!container) return;

  for (let i = 0; i < 40; i += 1) {
    const particle = document.createElement("div");
    particle.className = "quiz-confetti-particle";
    particle.style.backgroundColor =
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

    const startX = 50 + (Math.random() * 20 - 10);
    const startY = 50 + (Math.random() * 20 - 10);
    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;

    container.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 20 + Math.random() * 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 20;

    const animation = particle.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${tx}vw, ${ty}vh) scale(0)`, opacity: 0 },
      ],
      {
        duration: 600 + Math.random() * 400,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards",
      }
    );

    animation.onfinish = () => particle.remove();
    setTimeout(() => particle.remove(), 1200);
  }
}

// client/src/data/checkpoints.js
//
// Every quiz (per-chapter quizzes and Weekly/Monthly Challenges alike) caps
// at 5 levels. Each of those 5 levels has one fixed, unique "checkpoint"
// badge — same name/description/icon everywhere, regardless of which quiz
// or challenge it belongs to, so students learn to recognize their
// progress at a glance across the whole site.

// `tone` picks which color treatment (defined in quiz.css as
// .checkpoint-tone--<tone>) the checkpoint's icon badge renders in — each
// level is a real medal tier, escalating Olive → Bronze → Silver → Gold →
// Platinum, so the rank reads at a glance everywhere it shows up (level
// map, result medal, badge cards, the 3D badge itself).
export const CHECKPOINTS = [
  {
    level: 1,
    title: "First Steps",
    description: "You've taken your first steps into this topic — the basics are locked in.",
    icon: "spa",
    tone: "olive",
  },
  {
    level: 2,
    title: "Bridge Builder",
    description: "You're laying strong foundations, one concept at a time.",
    icon: "foundation",
    tone: "bronze",
  },
  {
    level: 3,
    title: "Concept Climber",
    description: "Halfway there — you're tackling tougher questions with confidence.",
    icon: "landscape",
    tone: "silver",
  },
  {
    level: 4,
    title: "Problem Solver",
    description: "You're navigating advanced problems like a pro.",
    icon: "explore",
    tone: "gold",
  },
  {
    level: 5,
    title: "Summit Champion",
    description: "You've reached the summit — full mastery achieved!",
    icon: "emoji_events",
    tone: "platinum",
  },
];

export function getCheckpoint(level) {
  return CHECKPOINTS[level - 1] || null;
}

// A ready-to-post caption for each tier, so a student who downloads their
// badge image has something to paste right alongside it (WhatsApp status,
// Instagram caption, etc.) instead of writing their own from scratch.
const TONE_SHARE_META = {
  olive: { label: "Olive", emoji: "🌱", line: "Starting strong — the basics are locked in." },
  bronze: { label: "Bronze", emoji: "🥉", line: "Building strong foundations, one concept at a time." },
  silver: { label: "Silver", emoji: "🥈", line: "Climbing with confidence, halfway to the summit." },
  gold: { label: "Gold", emoji: "🥇", line: "Navigating advanced problems like a pro." },
  platinum: { label: "Platinum", emoji: "🏆", line: "Full mastery achieved — reached the summit!" },
};

export function getShareMessage(tone, title, studentName) {
  const meta = TONE_SHARE_META[tone] || TONE_SHARE_META.olive;
  const who = studentName ? `${studentName} just` : "Just";
  return `${meta.emoji} ${who} earned the ${meta.label} badge — "${title}" — on Gyan Setu! ${meta.line} #GyanSetu`;
}

// client/src/data/checkpoints.js
//
// Every quiz (per-chapter quizzes and Weekly/Monthly Challenges alike) caps
// at 5 levels. Each of those 5 levels has one fixed, unique "checkpoint"
// badge — same name/description/icon everywhere, regardless of which quiz
// or challenge it belongs to, so students learn to recognize their
// progress at a glance across the whole site.

// `tone` picks which color treatment (defined in quiz.css as
// .checkpoint-tone--<tone>) the checkpoint's icon badge renders in —
// each of the 5 gets its own distinct look instead of one flat color.
export const CHECKPOINTS = [
  {
    level: 1,
    title: "First Steps",
    description: "You've taken your first steps into this topic — the basics are locked in.",
    icon: "spa",
    tone: "sprout",
  },
  {
    level: 2,
    title: "Bridge Builder",
    description: "You're laying strong foundations, one concept at a time.",
    icon: "foundation",
    tone: "clay",
  },
  {
    level: 3,
    title: "Concept Climber",
    description: "Halfway there — you're tackling tougher questions with confidence.",
    icon: "landscape",
    tone: "summit",
  },
  {
    level: 4,
    title: "Problem Solver",
    description: "You're navigating advanced problems like a pro.",
    icon: "explore",
    tone: "forest",
  },
  {
    level: 5,
    title: "Summit Champion",
    description: "You've reached the summit — full mastery achieved!",
    icon: "emoji_events",
    tone: "champion",
  },
];

export function getCheckpoint(level) {
  return CHECKPOINTS[level - 1] || null;
}

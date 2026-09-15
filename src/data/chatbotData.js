// client/src/data/chatbotData.js
//
// The Setu Assistant's whole script. It is deliberately a fixed set of
// questions — no free-text understanding, no API call — so it works on a
// static build and always answers correctly.
//
// Each topic:
//   id       unique key
//   question the chip a student taps (also shown as their message)
//   answer   the reply, as an array of paragraphs
//   actions  optional buttons: { label, to } navigates there, or
//            { label, action: "open-profile" } opens the name/avatar/class
//            settings modal right from the chat (handled in ChatBot.jsx)
import { CHECKPOINTS } from "./checkpoints";

const checkpointList = CHECKPOINTS.map((c) => `${c.level}. ${c.title}`).join("  ·  ");

export const CHAT_TOPICS = [
  {
    id: "start",
    question: "How do I start learning?",
    answer: [
      "Head to Courses, pick your class (Class 9 or Class 10), then Mathematics, then a chapter.",
      "Every chapter opens on an overview page with its video lectures, notes, tests and books — so you can start wherever you like.",
    ],
    actions: [{ label: "Browse courses", to: "/courses" }],
  },
  {
    id: "lectures",
    question: "Where are the video lectures?",
    answer: [
      "Inside each chapter. Open Courses → your class → Mathematics → the chapter, then choose Video Lectures.",
      "Every lecture plays right on the page from the Gyan Setu YouTube playlist — no downloads needed.",
    ],
    actions: [{ label: "Open courses", to: "/courses" }],
  },
  {
    id: "quiz-how",
    question: "How do the quizzes work?",
    answer: [
      "Each chapter quiz has up to 5 levels. Questions are multiple-choice or short typed answers — nothing else to learn.",
      "Before every level you choose Timed or Untimed. Timed gives each question its own countdown; Untimed lets you think as long as you want.",
      "Scoring is weighted by marks, and you need 60% to clear a level and unlock the next one.",
    ],
  },
  {
    id: "quiz-where",
    question: "Which chapters have quizzes right now?",
    answer: [
      "All 5 chapters currently on the site have their full quizzes live, for both Class 9 and Class 10 Mathematics.",
      "Any chapter without a quiz yet shows a 'Coming Soon' card instead — new ones get added as their questions are ready.",
    ],
    actions: [{ label: "Browse courses", to: "/courses" }],
  },
  {
    id: "badges",
    question: "How do I earn badges?",
    answer: [
      "Clear a quiz level and you earn that level's checkpoint badge. Five levels, five checkpoints:",
      checkpointList,
      "Chapter quizzes, weekly challenges and monthly challenges each award their own badges, so they never overlap.",
    ],
    actions: [{ label: "See my Trophy Room", to: "/my-badges" }],
  },
  {
    id: "badge-download",
    question: "Can I download my badge?",
    answer: [
      "Yes — open My Badges, pick an earned badge and tap View Badge.",
      "You get a real 3D badge with your name on it that you can drag to spin, and save as PNG, JPG, an animated GIF or an MP4 video.",
    ],
    actions: [{ label: "Open My Badges", to: "/my-badges" }],
  },
  {
    id: "challenges",
    question: "What are Weekly & Monthly Challenges?",
    answer: [
      "They're quizzes that aren't tied to any chapter — a fresh weekly one and a fresh monthly one, with their own badges.",
      "Use them to test what you've learned across topics rather than one chapter at a time.",
    ],
    actions: [{ label: "Open Challenges", to: "/challenges" }],
  },
  {
    id: "progress",
    question: "Is my progress saved?",
    answer: [
      "Yes, automatically — no login needed. Your levels, best scores and badges are stored right in this browser.",
      "Because it's saved on the device, using a different browser or phone starts a fresh record. Clearing your browsing data also clears it.",
    ],
  },
  {
    id: "settings",
    question: "Change my name, avatar or class",
    answer: [
      "Sure — tap below and I'll open your settings right here.",
      "You can update your name and avatar (both get engraved on every badge you earn) and switch which class's courses you see: Class 9 only, Class 10 only, or Full Access to both.",
    ],
    actions: [{ label: "Open my settings", action: "open-profile" }],
  },
  {
    id: "navigate",
    question: "Help me find my way around",
    answer: [
      "There are five places to know: Courses for lectures and notes, Challenges for the weekly and monthly quizzes, My Badges for your trophy room, About for who we are, and Contact to reach us.",
    ],
    actions: [
      { label: "Courses", to: "/courses" },
      { label: "Challenges", to: "/challenges" },
      { label: "My Badges", to: "/my-badges" },
    ],
  },
  {
    id: "contact",
    question: "How do I contact Gyan Setu?",
    answer: [
      "The Contact page has every way to reach us. If something on the site looks broken, mention which chapter or quiz you were on — it makes it much faster to fix.",
    ],
    actions: [{ label: "Open Contact", to: "/contact" }],
  },
];

export function getTopic(id) {
  return CHAT_TOPICS.find((topic) => topic.id === id) || null;
}

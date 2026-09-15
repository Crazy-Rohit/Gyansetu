// src/data/siteContent.js
//
// Marketing content for the Home/About pages (stats, features, how-it-works
// steps, testimonials). Edit the arrays below with your real numbers and
// quotes whenever you like — everything here is placeholder content.

export const stats = [
  { id: "students", value: 500, suffix: "+", label: "Students Taught", icon: "users" },
  { id: "years", value: 10, suffix: "+", label: "Years of Experience", icon: "shield" },
  { id: "classes", value: 2, suffix: "", label: "Classes Covered (9 & 10)", icon: "cap" },
  { id: "ncert", value: 100, suffix: "%", label: "NCERT Aligned", icon: "target" },
];

// icon: one of "spark", "target", "chart", "cap", "chat", "shield"
export const features = [
  {
    id: "clarity",
    icon: "spark",
    title: "Concept Clarity",
    description: "Every topic broken into simple steps so ideas actually stick, not just get memorized.",
  },
  {
    id: "attention",
    icon: "target",
    title: "Personal Attention",
    description: "Small batches mean every student's doubts get heard and solved, not lost in the crowd.",
  },
  {
    id: "practice",
    icon: "chart",
    title: "Regular Practice Tests",
    description: "Chapter-wise tests and previous year questions to track progress and build exam confidence.",
  },
  {
    id: "faculty",
    icon: "cap",
    title: "Experienced Faculty",
    description: "Years of experience teaching NCERT Mathematics to Class 9 and 10 students.",
  },
  {
    id: "support",
    icon: "chat",
    title: "Doubt Support",
    description: "Stuck on a problem? Ask anytime — no question is too small.",
  },
  {
    id: "board",
    icon: "shield",
    title: "Board-Focused Prep",
    description: "Structured revision and mock tests aligned to the board exam pattern.",
  },
];

export const steps = [
  {
    id: 1,
    number: "01",
    title: "Enroll",
    description: "Pick your class and get started — no long forms, no fuss.",
  },
  {
    id: 2,
    number: "02",
    title: "Learn Concepts",
    description: "Watch chapter-wise video lectures built around the NCERT syllabus.",
  },
  {
    id: 3,
    number: "03",
    title: "Practice & Test",
    description: "Revise with notes and put your understanding to the test.",
  },
  {
    id: 4,
    number: "04",
    title: "Excel in Boards",
    description: "Walk into the exam hall confident and well-prepared.",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Aarav Sharma",
    classLabel: "Class 10 Student",
    quote: "Maths finally makes sense! The chapter-wise notes and tests helped me a lot before my board exams.",
  },
  {
    id: 2,
    name: "Priya Verma",
    classLabel: "Class 9 Student",
    quote: "The lectures explain everything step by step. I actually look forward to Maths class now.",
  },
  {
    id: 3,
    name: "Rohan Gupta",
    classLabel: "Parent of Class 10 Student",
    quote: "Great personal attention — my son's confidence in Maths has improved so much this year.",
  },
];

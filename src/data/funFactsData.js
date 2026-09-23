// src/data/funFactsData.js
//
// This is the ENTIRE content database for the Home page's Fun Facts
// carousel. It is a GROWING list, not "this week's fact" — every week a
// new batch of cards is appended (usually at the top, newest first), and
// old cards stay forever. The carousel cycles through everything here.
//
// Content is authored in "Maths fun facts/week-N-slug.md" first (plain
// Markdown, easy to write), then transcribed into cards below. Each card
// is one slide in the carousel.
//
// Shape reference:
//
// funFacts: [
//   {
//     id: string        // unique slug, e.g. "w1-c3"
//     week: number       // which weekly batch this card belongs to
//     weekTitle: string  // the batch's topic, shown as a small breadcrumb
//     cardLabel: string  // a short, fancy step title — these read as a
//                          // journey through the topic, not "Card N"
//     icon: string       // one of FeatureIcon's icon names
//     body: string        // markdown-lite: blank-line-separated paragraphs,
//                          // "- " list items, **bold**, *italic*
//   }
// ]
//
// Newest week should be added at the TOP of this array so the carousel
// opens on the freshest content; older weeks stay below, still reachable.

export const funFacts = [
  {
    id: "w1-c1",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "The Big Question",
    icon: "spark",
    body: `Before we dive into primes, patterns, and tricks — let's start at the very beginning.

What exactly *is* a number?`,
  },
  {
    id: "w1-c2",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Natural Numbers",
    icon: "cap",
    body: `The numbers you first learned to count with —
1, 2, 3, 4, 5, ...
are called **Natural Numbers**.

They start from 1 and go on forever.`,
  },
  {
    id: "w1-c3",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Whole Numbers",
    icon: "target",
    body: `Now add one more number to this list: **0**.
1, 2, 3, 4, 5, ... and 0
This new group is called **Whole Numbers**.

*Did You Know?* Every natural number is a whole number, but 0 is a whole number that is *not* natural.`,
  },
  {
    id: "w1-c4",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Enter the Integers",
    icon: "chart",
    body: `But numbers don't stop at 0.
What about **−1, −2, −3, ...**?

Whole numbers + negative numbers = **Integers**
... −3, −2, −1, 0, 1, 2, 3 ...`,
  },
  {
    id: "w1-c5",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Rational Numbers",
    icon: "shield",
    body: `Integers still aren't the full picture.
What about a number like **½** or **0.75**?

These can be written as a fraction p/q, where q ≠ 0.
Such numbers are called **Rational Numbers**.`,
  },
  {
    id: "w1-c6",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "The Irrational Twist",
    icon: "spark",
    body: `Now here's where it gets interesting.
Try writing **√2** as a fraction.

Go on — try it.

You can't. No matter how hard you try, √2 cannot be written as p/q.
Numbers like this are called **Irrational Numbers**.`,
  },
  {
    id: "w1-c7",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "The Full Picture",
    icon: "cap",
    body: `So we have:

- Natural Numbers → 1, 2, 3, ...
- Whole Numbers → 0, 1, 2, 3, ...
- Integers → ..., −2, −1, 0, 1, 2, ...
- Rational Numbers → can be written as p/q
- Irrational Numbers → cannot be written as p/q

Put all of these together, and you get the **Real Numbers** — every number you'll use in Class 9 and 10.`,
  },
  {
    id: "w1-c8",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Your Turn to Try",
    icon: "target",
    body: `Classify each number: Natural, Whole, Integer, Rational, or Irrational (a number can belong to more than one group)

- 7
- 0
- −5
- 3/4
- √5`,
  },
  {
    id: "w1-c9",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "Solutions Revealed",
    icon: "chart",
    body: `- 7 → Natural, Whole, Integer, Rational
- 0 → Whole, Integer, Rational
- −5 → Integer, Rational
- 3/4 → Rational
- √5 → Irrational`,
  },
  {
    id: "w1-c10",
    week: 1,
    weekTitle: "What Are Numbers, Really?",
    cardLabel: "One Last Puzzle",
    icon: "chat",
    body: `Here's a question to sit with until next week:
Is **√4** rational or irrational?

It *looks* irrational because it has a square root sign... but is it really?`,
  },
];

export function getFunFacts() {
  return funFacts;
}

/**
 * One entry per week, in first-appearance order — the "Fun Fact 1", "Fun
 * Fact 2", ... cards on the Fun Facts listing page. Each carries its
 * weekTitle and how many cards that week has.
 */
export function getFunFactWeeks() {
  const weeks = [];
  for (const fact of funFacts) {
    let entry = weeks.find((w) => w.week === fact.week);
    if (!entry) {
      entry = { week: fact.week, weekTitle: fact.weekTitle, cardCount: 0 };
      weeks.push(entry);
    }
    entry.cardCount += 1;
  }
  return weeks;
}

export function getFunFactsByWeek(week) {
  const weekNum = Number(week);
  return funFacts.filter((fact) => fact.week === weekNum);
}

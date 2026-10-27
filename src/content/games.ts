// The game list stays free of the games' own content, so pages that only link to games don't load it.
// tests/lab.test.ts checks that each `meta` states the real number of questions, pairs or commands.

export type GameId = "developers-mind" | "brain-clash" | "snake" | "code-quest" | "bug-hunter" | "memory-match" | "terminal";

export interface GameInfo {
  id: GameId;
  name: string;
  summary: string;
  detail: string;
  meta: string;
  /** Featured games get a card in The Lab on the home page; the rest are listed on the Lab page. */
  featured?: boolean;
}

export const games: GameInfo[] = [
  {
    id: "developers-mind",
    name: "The Developer's Mind",
    summary: "Think clearly. Solve the puzzle. Beat your best score.",
    detail:
      "Five short challenges: a number sequence, a logic puzzle, a pattern, a bug to spot and a state machine to follow. Play against the clock or without it.",
    meta: "5 challenges from 11 · timed or relaxed",
    featured: true,
  },
  {
    id: "brain-clash",
    name: "Brain Clash Mini",
    summary: "A quick quiz inspired by VoxPlay's team game.",
    detail:
      "Five questions on programming, technology, general knowledge, patterns and riddles, fifteen seconds each. Play solo or pass the device between two players.",
    meta: "5 questions from 15 · solo or 2 players",
    featured: true,
  },
  {
    id: "snake",
    name: "Snake",
    summary: "The classic, rebuilt with tested game logic.",
    detail: "Steer with the keyboard, the on-screen buttons or a swipe. It speeds up as you eat.",
    meta: "Keyboard, buttons or swipe",
  },
  {
    id: "code-quest",
    name: "Code Quest",
    summary: "A programming quiz with instant feedback.",
    detail: "JavaScript, TypeScript, Python, HTTP, SQL, React, security and CSS. Every answer comes with an explanation.",
    meta: "12 questions · no timer",
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    summary: "Find the line with the bug.",
    detail: "Short snippets in TypeScript, React and Python. One of the bugs comes from my own early code.",
    meta: "6 challenges · 2 tries each",
  },
  {
    id: "memory-match",
    name: "Memory Match",
    summary: "Pair each technology with what it does.",
    detail: "A memory game with a twist: you match a tool to its job, not two identical cards.",
    meta: "8 pairs · fewest moves wins",
  },
  {
    id: "terminal",
    name: "Developer Terminal",
    summary: "Explore this portfolio with commands.",
    detail: "Type help, projects, skills or contact. It only reads this site's content; it can't run system commands.",
    meta: "10 commands · Tab completes",
  },
];

export function getGame(id: string): GameInfo | undefined {
  return games.find((g) => g.id === id);
}

// Content for the two featured Lab games. tests/lab.test.ts checks every answer key, so a wrong key fails the
// tests instead of reaching visitors. Keep each question unambiguous: exactly one option should be defensible.

export type ChallengeKind = "sequence" | "logic" | "debug" | "pattern" | "state";

export interface Choice {
  id: string;
  prompt: string;
  /** Monospace block shown under the prompt: code, a sequence or a small diagram. */
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface MindChallenge extends Choice {
  kind: ChallengeKind;
}

export const challengeKindLabels: Record<ChallengeKind, string> = {
  sequence: "Number sequence",
  logic: "Logic",
  debug: "Debugging",
  pattern: "Pattern",
  state: "State transitions",
};

/** One challenge of each kind is drawn per game, in this order. */
export const challengeOrder: ChallengeKind[] = ["sequence", "logic", "pattern", "debug", "state"];

export const mindChallenges: MindChallenge[] = [
  {
    id: "seq-pronic",
    kind: "sequence",
    prompt: "What comes next?",
    code: "2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    answer: 2,
    explanation: "The gaps grow by two each time (+4, +6, +8, +10), so the next gap is +12: 30 + 12 = 42.",
  },
  {
    id: "seq-fibonacci",
    kind: "sequence",
    prompt: "What comes next?",
    code: "1, 1, 2, 3, 5, 8, ?",
    options: ["11", "12", "13", "16"],
    answer: 2,
    explanation: "Each number is the sum of the two before it (the Fibonacci sequence): 5 + 8 = 13.",
  },
  {
    id: "seq-powers",
    kind: "sequence",
    prompt: "What comes next?",
    code: "3, 9, 27, 81, ?",
    options: ["108", "162", "243", "324"],
    answer: 2,
    explanation: "Each number is three times the one before it: 81 × 3 = 243.",
  },
  {
    id: "logic-contrapositive",
    kind: "logic",
    prompt: "“If it rains, the match is cancelled.” The match was not cancelled. What must be true?",
    options: ["It rained", "It did not rain", "It might have rained", "The match was postponed"],
    answer: 1,
    explanation:
      "If rain always cancels the match, a match that went ahead means it can't have rained. (The reverse doesn't hold: a cancelled match doesn't prove it rained.)",
  },
  {
    id: "logic-deploys",
    kind: "logic",
    prompt: "“Every deployment runs the test suite first.” Release 4.2 was deployed. Which statement must be true?",
    options: ["Release 4.2 has no bugs", "The tests ran before release 4.2 was deployed", "Every release that ran the tests was deployed", "Release 4.2 was deployed on time"],
    answer: 1,
    explanation:
      "The rule only guarantees the tests ran. Passing tests don't prove there are no bugs, and running the tests doesn't mean a release was deployed.",
  },
  {
    id: "pattern-binary",
    kind: "pattern",
    prompt: "What comes next?",
    code: "1, 10, 11, 100, 101, ?",
    options: ["102", "110", "111", "1000"],
    answer: 1,
    explanation: "These are the numbers 1 to 5 written in binary. Six in binary is 110.",
  },
  {
    id: "pattern-shapes",
    kind: "pattern",
    prompt: "The pattern repeats. Which shape is in position 11?",
    code: "▲ ■ ● ◆ ▲ ■ ● ◆ …",
    options: ["▲", "■", "●", "◆"],
    answer: 2,
    explanation: "The pattern repeats every 4 shapes. Position 11 is 3 more than 8, so it is the third shape: ●.",
  },
  {
    id: "debug-average",
    kind: "debug",
    prompt: "What does average([2, 4, 6]) return?",
    code: `function average(nums) {
  let total = 0;
  for (let i = 1; i < nums.length; i++) {
    total += nums[i];
  }
  return total / nums.length;
}`,
    options: ["4", "10 / 3, about 3.33", "5", "NaN"],
    answer: 1,
    explanation: "The loop starts at index 1, so it skips the first number: (4 + 6) / 3 ≈ 3.33. Starting at i = 0 fixes it.",
  },
  {
    id: "debug-assignment",
    kind: "debug",
    prompt: "This check is meant to let only admins through. What actually happens?",
    code: `if (user.role = "admin") {
  showAdminPanel();
}`,
    options: ["Only admins see the panel", "Nobody sees the panel", "Every user sees the panel", "It throws a SyntaxError"],
    answer: 2,
    explanation:
      "A single = assigns \"admin\" to user.role, and a non-empty string is truthy, so every user is let in (and their role is overwritten). It should be ===.",
  },
  {
    id: "state-delivery",
    kind: "state",
    prompt: "A delivery can only move along these arrows. Starting from pending, which path is valid?",
    code: `pending  → assigned
assigned → en_route
en_route → delivered
(any state except delivered) → cancelled`,
    options: [
      "pending → en_route → delivered",
      "pending → assigned → en_route → delivered",
      "pending → assigned → delivered",
      "pending → delivered → cancelled",
    ],
    answer: 1,
    explanation:
      "Only this path follows an arrow at every step. A delivered parcel can't be cancelled, and no state can skip ahead. (RouteBridge enforces its delivery states with a table like this.)",
  },
  {
    id: "state-toggle",
    kind: "state",
    prompt: "A switch starts OFF. A press flips it; a long hold always resets it to OFF. What is it after these inputs?",
    code: "press, press, press, hold, press",
    options: ["ON", "OFF", "It depends on timing", "Undefined"],
    answer: 0,
    explanation: "press → ON, press → OFF, press → ON, hold → OFF, press → ON.",
  },
];

export type ClashTopic = "Programming" | "Technology" | "General knowledge" | "Patterns" | "Riddles";

export interface ClashQuestion extends Choice {
  topic: ClashTopic;
}

export const clashQuestions: ClashQuestion[] = [
  {
    id: "mod",
    topic: "Programming",
    prompt: "What is 17 % 5?",
    options: ["2", "3", "3.4", "12"],
    answer: 0,
    explanation: "% gives the remainder: 17 = 3 × 5 + 2.",
  },
  {
    id: "bool",
    topic: "Programming",
    prompt: "What does true && false || true evaluate to?",
    options: ["true", "false", "undefined", "It throws an error"],
    answer: 0,
    explanation: "&& binds tighter than ||: (true && false) || true → false || true → true.",
  },
  {
    id: "index",
    topic: "Programming",
    prompt: "In most programming languages, what is the index of the first item in an array?",
    options: ["0", "1", "-1", "It depends on the item"],
    answer: 0,
    explanation: "Arrays in JavaScript, Python, Java and C are zero-indexed.",
  },
  {
    id: "404",
    topic: "Technology",
    prompt: "Which HTTP status code means “Not Found”?",
    options: ["200", "301", "404", "500"],
    answer: 2,
    explanation: "404 means the server has nothing at that address. 500 is a server error.",
  },
  {
    id: "byte",
    topic: "Technology",
    prompt: "How many bits are in a byte?",
    options: ["4", "8", "16", "32"],
    answer: 1,
    explanation: "A byte is 8 bits, enough for 256 different values.",
  },
  {
    id: "typescript",
    topic: "Technology",
    prompt: "Which company created TypeScript?",
    options: ["Google", "Meta", "Microsoft", "Apple"],
    answer: 2,
    explanation: "Microsoft released TypeScript in 2012.",
  },
  {
    id: "algeria",
    topic: "General knowledge",
    prompt: "What is the largest country in Africa by area?",
    options: ["Nigeria", "Algeria", "DR Congo", "Sudan"],
    answer: 1,
    explanation: "Algeria has been Africa's largest country since Sudan split in 2011. (This one is from VoxPlay's Brain Clash question bank.)",
  },
  {
    id: "abuja",
    topic: "General knowledge",
    prompt: "What is the capital of Nigeria?",
    options: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
    answer: 1,
    explanation: "Abuja replaced Lagos as Nigeria's capital in 1991.",
  },
  {
    id: "nile",
    topic: "General knowledge",
    prompt: "Which is the longest river in Africa?",
    options: ["Niger", "Congo", "Nile", "Zambezi"],
    answer: 2,
    explanation: "The Nile, at roughly 6,650 km, is the longest river in Africa.",
  },
  {
    id: "squares",
    topic: "Patterns",
    prompt: "What comes next: 1, 4, 9, 16, … ?",
    options: ["20", "24", "25", "32"],
    answer: 2,
    explanation: "They are square numbers: 1², 2², 3², 4², so next is 5² = 25.",
  },
  {
    id: "months",
    topic: "Patterns",
    prompt: "What comes next: J, F, M, A, M, J, … ?",
    options: ["A", "J", "S", "N"],
    answer: 1,
    explanation: "They are the first letters of the months. After June comes July: J.",
  },
  {
    id: "doubling",
    topic: "Patterns",
    prompt: "What comes next: 5, 10, 20, 40, … ?",
    options: ["60", "70", "80", "100"],
    answer: 2,
    explanation: "Each number doubles: 40 × 2 = 80.",
  },
  {
    id: "footsteps",
    topic: "Riddles",
    prompt: "The more you take, the more you leave behind. What are they?",
    options: ["Photos", "Footsteps", "Breaths", "Notes"],
    answer: 1,
    explanation: "Every step you take leaves a footstep behind.",
  },
  {
    id: "keyboard",
    topic: "Riddles",
    prompt: "I have keys but open no locks, and space but no room. What am I?",
    options: ["A map", "A keyboard", "A safe", "A house"],
    answer: 1,
    explanation: "A keyboard has keys and a space bar.",
  },
  {
    id: "echo",
    topic: "Riddles",
    prompt: "I speak without a mouth and hear without ears. What am I?",
    options: ["A radio", "A parrot", "An echo", "A phone"],
    answer: 2,
    explanation: "The classic riddle: an echo “speaks” back what it “hears”, with no mouth or ears.",
  },
];

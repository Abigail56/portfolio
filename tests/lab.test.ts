import { describe, expect, it } from "vitest";
import { challengeOrder, clashQuestions, mindChallenges, type Choice } from "@/content/lab";
import { games } from "@/content/games";
import { bugChallenges, memoryPairs, quizQuestions } from "@/content/playground";
import { commandNames } from "@/lib/terminal";
import { answerPoints, clashAchievement, clashWinner, mindAchievement, pickClashRound, pickMindRound } from "@/lib/quiz";

function sequence(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length]!;
}

describe.each([
  ["The Developer's Mind", mindChallenges as Choice[]],
  ["Brain Clash Mini", clashQuestions as Choice[]],
])("%s content", (_name, pool) => {
  it("has unique ids", () => {
    expect(new Set(pool.map((c) => c.id)).size).toBe(pool.length);
  });

  it("has four distinct options and a valid answer key", () => {
    for (const c of pool) {
      expect(c.options, c.id).toHaveLength(4);
      expect(new Set(c.options).size, c.id).toBe(4);
      expect(c.answer, c.id).toBeGreaterThanOrEqual(0);
      expect(c.answer, c.id).toBeLessThan(c.options.length);
      expect(c.explanation.length, c.id).toBeGreaterThan(15);
    }
  });
});

describe("answer keys that can be computed", () => {
  const answer = (id: string) => {
    const c = [...mindChallenges, ...clashQuestions].find((x) => x.id === id)!;
    return c.options[c.answer];
  };

  it("matches the arithmetic", () => {
    expect(answer("seq-pronic")).toBe(String(6 * 7));
    expect(answer("seq-fibonacci")).toBe(String(5 + 8));
    expect(answer("seq-powers")).toBe(String(3 ** 5));
    expect(answer("pattern-binary")).toBe((6).toString(2));
    expect(answer("mod")).toBe(String(17 % 5));
    expect(answer("squares")).toBe(String(5 ** 2));
    expect(answer("doubling")).toBe(String(40 * 2));
    expect(answer("bool")).toBe(String(true && false || true));
  });

  it("matches the repeating shape pattern", () => {
    const shapes = ["▲", "■", "●", "◆"];
    expect(answer("pattern-shapes")).toBe(shapes[(11 - 1) % 4]);
  });

  it("matches the buggy average function", () => {
    function average(nums: number[]) {
      let total = 0;
      for (let i = 1; i < nums.length; i++) total += nums[i]!;
      return total / nums.length;
    }
    expect(average([2, 4, 6])).toBeCloseTo(10 / 3);
    expect(answer("debug-average")).toContain("10 / 3");
  });

  it("matches the toggle state machine", () => {
    let on = false;
    for (const input of ["press", "press", "press", "hold", "press"]) on = input === "hold" ? false : !on;
    expect(answer("state-toggle")).toBe(on ? "ON" : "OFF");
  });
});

describe("rounds", () => {
  it("draws one Developer's Mind challenge of each kind, in order", () => {
    const round = pickMindRound(mindChallenges, sequence([0.9, 0.1, 0.5]));
    expect(round.map((c) => c.kind)).toEqual(challengeOrder);
  });

  it("draws distinct Brain Clash questions", () => {
    const round = pickClashRound(clashQuestions, 10, sequence([0.3, 0.7, 0.1]));
    expect(round).toHaveLength(10);
    expect(new Set(round.map((q) => q.id)).size).toBe(10);
  });

  it("scores correct answers with a speed bonus and nothing for misses", () => {
    expect(answerPoints(true, 10, 5)).toBe(150);
    expect(answerPoints(true, null, 2)).toBe(100);
    expect(answerPoints(false, 10, 5)).toBe(0);
    expect(answerPoints(true, -3, 5)).toBe(100);
  });

  it("labels results and winners", () => {
    expect(mindAchievement(5, 5)).toMatch(/five for five/);
    expect(mindAchievement(0, 5)).toBe("Fresh start");
    expect(clashAchievement(5, 5)).toBe("Clean sweep");
    expect(clashWinner([300, 300])).toBe("tie");
    expect(clashWinner([100, 300])).toBe("player-2");
  });
});

describe("game listing", () => {
  const meta = (id: string) => games.find((g) => g.id === id)!.meta;

  it("states the real size of each game", () => {
    expect(meta("developers-mind")).toContain(`from ${mindChallenges.length}`);
    expect(meta("brain-clash")).toContain(`from ${clashQuestions.length}`);
    expect(meta("code-quest")).toContain(`${quizQuestions.length} questions`);
    expect(meta("bug-hunter")).toContain(`${bugChallenges.length} challenges`);
    expect(meta("memory-match")).toContain(`${memoryPairs.length} pairs`);
    expect(meta("terminal")).toContain(`${commandNames.length} commands`);
  });

  it("features exactly the two Lab games", () => {
    expect(games.filter((g) => g.featured).map((g) => g.id)).toEqual(["developers-mind", "brain-clash"]);
  });
});

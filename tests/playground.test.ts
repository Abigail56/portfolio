import { describe, expect, it } from "vitest";
import { bugChallenges, memoryPairs, quizQuestions } from "@/content/playground";
import { buildMemoryDeck, formatDuration, isMatch, shuffle } from "@/lib/games";

function question(id: string) {
  const q = quizQuestions.find((x) => x.id === id);
  if (!q) throw new Error(`missing question ${id}`);
  return q;
}

describe("Code Quest answer key", () => {
  it("has well-formed questions", () => {
    const ids = new Set<string>();
    for (const q of quizQuestions) {
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });

  // The JavaScript questions are executed for real, so the answer key can't drift from the language.
  it("typeof null", () => {
    const q = question("typeof-null");
    expect(q.options[q.answer]).toBe(`"${typeof null}"`);
  });

  it("[\"1\",\"2\",\"3\"].map(parseInt)", () => {
    const q = question("map-parseint");
    const actual = ["1", "2", "3"].map(parseInt);
    expect(q.options[q.answer]).toBe(`[${actual.map(String).join(", ")}]`);
  });

  it("event loop ordering", async () => {
    const q = question("event-loop");
    const log: string[] = [];
    await new Promise<void>((resolve) => {
      log.push("A");
      setTimeout(() => {
        log.push("B");
        resolve();
      }, 0);
      void Promise.resolve().then(() => log.push("C"));
      log.push("D");
    });
    expect(q.options[q.answer]).toBe(log.join(" "));
  });

  it("React reads one snapshot per render", () => {
    let count = 0;
    const snapshot = count;
    const setCount = (v: number) => (count = v);
    setCount(snapshot + 1);
    setCount(snapshot + 1);
    const q = question("react-batching");
    expect(q.options[q.answer]).toBe(String(count));
  });
});

describe("Bug Hunter", () => {
  it("points at a real, non-empty line", () => {
    for (const c of bugChallenges) {
      const line = c.lines[c.bugLine - 1];
      expect(line, c.id).toBeDefined();
      expect(line?.trim().length, c.id).toBeGreaterThan(0);
      expect(c.fix.length).toBeGreaterThan(5);
    }
  });
});

describe("Memory Match", () => {
  it("builds a deck with two cards per pair", () => {
    const deck = buildMemoryDeck(memoryPairs, () => 0.42);
    expect(deck).toHaveLength(memoryPairs.length * 2);
    expect(new Set(deck.map((c) => c.key)).size).toBe(deck.length);
    for (const pair of memoryPairs) expect(deck.filter((c) => c.pairId === pair.id)).toHaveLength(2);
  });

  it("matches a term with its meaning but never a card with itself", () => {
    const deck = buildMemoryDeck(memoryPairs);
    const term = deck.find((c) => c.pairId === "redis" && c.face === "term")!;
    const meaning = deck.find((c) => c.pairId === "redis" && c.face === "meaning")!;
    const other = deck.find((c) => c.pairId === "docker")!;
    expect(isMatch(term, meaning)).toBe(true);
    expect(isMatch(term, term)).toBe(false);
    expect(isMatch(term, other)).toBe(false);
  });
});

describe("helpers", () => {
  it("shuffle keeps every item and does not mutate its input", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual(input);
  });

  it("formats durations", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(75)).toBe("1:15");
  });
});

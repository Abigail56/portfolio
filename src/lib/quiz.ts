import { challengeOrder, type ClashQuestion, type MindChallenge } from "@/content/lab";
import { shuffle } from "./games";

// Pure helpers for the two featured Lab games. Randomness is injectable so tests are deterministic.

export const MIND_SECONDS = 45;
export const CLASH_SECONDS = 15;
export const CLASH_ROUND = 5;

/** One challenge of each kind, in a fixed kind order, picked at random from the pool. */
export function pickMindRound(pool: readonly MindChallenge[], random: () => number = Math.random): MindChallenge[] {
  return challengeOrder.map((kind) => {
    const options = pool.filter((c) => c.kind === kind);
    const pick = options[Math.floor(random() * options.length)];
    if (!pick) throw new Error(`No challenge of kind "${kind}"`);
    return pick;
  });
}

/** `count` distinct questions in random order. */
export function pickClashRound(pool: readonly ClashQuestion[], count: number, random: () => number = Math.random): ClashQuestion[] {
  return shuffle(pool, random).slice(0, count);
}

/**
 * Points for one answer: nothing for a wrong answer or a timeout, 100 for a correct one,
 * plus a speed bonus when a timer is running (`secondsLeft` is null in relaxed mode).
 */
export function answerPoints(correct: boolean, secondsLeft: number | null, bonusPerSecond: number): number {
  if (!correct) return 0;
  return 100 + Math.max(0, secondsLeft ?? 0) * bonusPerSecond;
}

/** A playful label for the end screen. Deliberately not a judgement of anyone's engineering ability. */
export function mindAchievement(correct: number, total: number): string {
  if (total > 0 && correct === total) return "Clear thinker: five for five";
  if (correct >= total - 1) return "Sharp eye";
  if (correct >= Math.ceil(total / 2)) return "Steady reasoning";
  if (correct > 0) return "Warming up";
  return "Fresh start";
}

export function clashAchievement(correct: number, total: number): string {
  if (total > 0 && correct === total) return "Clean sweep";
  if (correct >= total - 1) return "Quiz captain";
  if (correct >= Math.ceil(total / 2)) return "On the board";
  return "Rematch time";
}

export type ClashWinner = "player-1" | "player-2" | "tie";

export function clashWinner(scores: readonly [number, number]): ClashWinner {
  if (scores[0] === scores[1]) return "tie";
  return scores[0] > scores[1] ? "player-1" : "player-2";
}

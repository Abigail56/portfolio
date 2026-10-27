import type { MemoryPair } from "@/content/playground";

/** Fisher–Yates shuffle. Returns a new array; `random` is injectable so tests are deterministic. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}

export interface MemoryCard {
  key: string;
  pairId: string;
  face: "term" | "meaning";
  text: string;
}

export function buildMemoryDeck(pairs: readonly MemoryPair[], random?: () => number): MemoryCard[] {
  const cards = pairs.flatMap<MemoryCard>((p) => [
    { key: `${p.id}-term`, pairId: p.id, face: "term", text: p.term },
    { key: `${p.id}-meaning`, pairId: p.id, face: "meaning", text: p.meaning },
  ]);
  return shuffle(cards, random);
}

export function isMatch(a: MemoryCard, b: MemoryCard): boolean {
  return a.pairId === b.pairId && a.key !== b.key;
}

export function scoreLabel(correct: number, total: number): string {
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio === 1) return "Perfect run.";
  if (ratio >= 0.75) return "Strong result.";
  if (ratio >= 0.5) return "Solid. Some of these are tricky.";
  return "Worth another round: each answer comes with an explanation.";
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

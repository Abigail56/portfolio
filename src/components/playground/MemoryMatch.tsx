import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { memoryPairs } from "@/content/playground";
import { buildMemoryDeck, formatDuration, isMatch, type MemoryCard } from "@/lib/games";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GameIntro } from "./PlaygroundShell";

const MISMATCH_DELAY_MS = 1000;

export function MemoryMatch() {
  const [deck, setDeck] = useState<MemoryCard[] | null>(null);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [best, setBest] = useStoredNumber("memory-match-best-moves");
  const timeoutRef = useRef<number | undefined>(undefined);

  const won = deck !== null && matched.size === memoryPairs.length;

  function start() {
    window.clearTimeout(timeoutRef.current);
    setDeck(buildMemoryDeck(memoryPairs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setStartedAt(Date.now());
    setElapsed(0);
    setAnnouncement(`New game. ${memoryPairs.length * 2} cards face down.`);
  }

  // The clock ticks once a second while a game is in progress.
  useEffect(() => {
    if (deck === null || won) return;
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [deck, won, startedAt]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function flip(card: MemoryCard) {
    if (!deck || flipped.length === 2 || flipped.includes(card.key) || matched.has(card.pairId)) return;
    const nowFlipped = [...flipped, card.key];
    setFlipped(nowFlipped);
    if (nowFlipped.length < 2) {
      setAnnouncement(`${card.text}.`);
      return;
    }

    const first = deck.find((c) => c.key === nowFlipped[0]);
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    if (first && isMatch(first, card)) {
      const nextMatched = new Set(matched).add(card.pairId);
      setMatched(nextMatched);
      setFlipped([]);
      const pair = memoryPairs.find((p) => p.id === card.pairId);
      if (nextMatched.size === memoryPairs.length) {
        setAnnouncement(`Match: ${pair?.term}, ${pair?.meaning}. All pairs found in ${nextMoves} moves.`);
        if (best === null || nextMoves < best) setBest(nextMoves);
      } else {
        setAnnouncement(`Match: ${pair?.term}, ${pair?.meaning}.`);
      }
    } else {
      setAnnouncement(`${card.text}. No match.`);
      timeoutRef.current = window.setTimeout(() => setFlipped([]), MISMATCH_DELAY_MS);
    }
  }

  if (deck === null) {
    return (
      <GameIntro
        title="Match each technology to its job"
        points={[`${memoryPairs.length * 2} cards: half are tools, half describe what they do.`, "Turn over two at a time.", "Finish in as few moves as you can."]}
        best={best !== null ? `${best} moves` : null}
        onStart={start}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex gap-5 font-mono text-muted">
          <span>
            Moves <span className="text-fg">{moves}</span>
          </span>
          <span>
            Pairs <span className="text-fg">{matched.size}</span>/{memoryPairs.length}
          </span>
          <span>
            Time <span className="text-fg">{formatDuration(elapsed)}</span>
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={start}>
          <RotateCcw aria-hidden className="size-3.5" />
          Restart
        </Button>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <ul className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Cards">
        {deck.map((card, i) => {
          const isMatched = matched.has(card.pairId);
          const faceUp = isMatched || flipped.includes(card.key);
          return (
            <li key={card.key}>
              <button
                type="button"
                onClick={() => flip(card)}
                disabled={isMatched}
                aria-label={faceUp ? `Card ${i + 1}: ${card.text}${isMatched ? ", matched" : ""}` : `Card ${i + 1}, face down`}
                className={cn(
                  "flex aspect-[4/5] w-full flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-colors duration-200 sm:aspect-[5/4] sm:p-3",
                  !faceUp && "border-line-strong bg-surface-2 hover:border-accent-line",
                  faceUp && !isMatched && "border-accent bg-accent-soft",
                  isMatched && "border-success/50 bg-success-soft",
                )}
              >
                {faceUp ? (
                  <>
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-subtle sm:text-[0.625rem]">
                      {card.face === "term" ? "tool" : "job"}
                    </span>
                    <span
                      className={cn(
                        "mt-1 leading-tight text-fg",
                        card.face === "term" ? "text-[0.75rem] font-semibold sm:text-base" : "text-[0.6875rem] sm:text-sm",
                      )}
                    >
                      {card.text}
                    </span>
                  </>
                ) : (
                  <span aria-hidden className="font-mono text-lg text-subtle">
                    {"{ }"}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {won && (
        <div className="mt-6 rounded-xl border border-success/40 bg-success-soft p-5 text-center">
          <p className="text-lg font-semibold text-fg">
            All {memoryPairs.length} pairs in {moves} moves and {formatDuration(elapsed)}.
          </p>
          <p className="mt-1 text-sm text-muted">
            {best !== null && moves <= best ? "That's your best so far." : best !== null ? `Your best is ${best} moves.` : ""}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button onClick={start}>Play again</Button>
            <ButtonLink href="/playground" variant="secondary">
              Back to the Lab
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

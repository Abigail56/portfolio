import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, User, Users, Zap } from "lucide-react";
import Link from "next/link";
import { clashQuestions, type ClashQuestion } from "@/content/lab";
import { answerPoints, CLASH_ROUND, CLASH_SECONDS, clashAchievement, clashWinner, pickClashRound } from "@/lib/quiz";
import { useCountdown } from "@/lib/useCountdown";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { QuestionCard, TimerBar, type Outcome } from "./QuestionCard";

type Phase = "intro" | "playing" | "done";
type Players = 1 | 2;

interface Result {
  question: ClashQuestion;
  player: 0 | 1;
  outcome: Exclude<Outcome, null>;
  points: number;
}

// VoxPlay's look, toned down: deep purple, a blue-to-violet accent, no glow.
const solid =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4f6ff5] to-[#8b5cf6] px-5 text-sm font-semibold text-white transition-[filter] hover:brightness-110 active:translate-y-px";
const quiet =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10 active:translate-y-px";

/**
 * A five-question quiz in the spirit of VoxPlay's Brain Clash. Single player, or two players taking turns on the
 * same device (five questions each). It runs entirely in the browser; there is no online multiplayer here.
 */
export function BrainClashMini() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [players, setPlayers] = useState<Players>(1);
  const [round, setRound] = useState<ClashQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const [best, setBest] = useStoredNumber("brain-clash-mini-best");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const question = round[index];
  const current = results[index];
  const player: 0 | 1 = players === 2 ? ((index % 2) as 0 | 1) : 0;
  const scores: [number, number] = [0, 0];
  for (const r of results) scores[r.player] += r.points;
  let streak = 0;
  for (let i = results.length - 1; i >= 0 && players === 1; i--) {
    if (results[i]!.points === 0) break;
    streak++;
  }

  const left = useCountdown(CLASH_SECONDS, phase === "playing" && !current, `${phase}-${index}-${round.length}`, () => settle("timeout"));

  function start() {
    setRound(pickClashRound(clashQuestions, CLASH_ROUND * players));
    setIndex(0);
    setResults([]);
    setPhase("playing");
  }

  function settle(outcome: Exclude<Outcome, null>) {
    if (!question || current) return;
    const points = answerPoints(outcome === question.answer, left, 5);
    setResults((prev) => [...prev, { question, player, outcome, points }]);
  }

  function advance() {
    if (index + 1 < round.length) {
      setIndex(index + 1);
      return;
    }
    if (players === 1) {
      setPreviousBest(best);
      if (best === null || scores[0] > best) setBest(scores[0]);
    }
    setPhase("done");
  }

  useEffect(() => {
    if (phase === "playing" && !current) headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);
  useEffect(() => {
    if (current) nextRef.current?.focus();
  }, [current]);
  useEffect(() => {
    if (phase === "done") resultRef.current?.focus();
  }, [phase]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2a2257] bg-[#120e2b] text-white shadow-lg [background-image:radial-gradient(120%_80%_at_100%_0%,rgb(124_92_255/0.18),transparent_60%),radial-gradient(90%_70%_at_0%_100%,rgb(79_111_245/0.14),transparent_60%)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
        <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.01em]">
          <Zap aria-hidden className="size-4 text-[#a99bff]" />
          Brain Clash <span className="font-normal text-[#c3bde3]">Mini</span>
        </p>
        {phase === "playing" && (
          <p className="text-sm text-[#c3bde3]">
            {players === 2 ? (
              <>
                P1 <span className="font-mono font-semibold tabular-nums text-white">{scores[0]}</span>
                <span className="mx-2 text-white/30">·</span>
                P2 <span className="font-mono font-semibold tabular-nums text-white">{scores[1]}</span>
              </>
            ) : (
              <>
                Score <span className="font-mono font-semibold tabular-nums text-white">{scores[0]}</span>
                {streak > 1 && <span className="ml-3 text-[#a99bff]">Streak ×{streak}</span>}
              </>
            )}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-8">
        {phase === "intro" && (
          <div className="mx-auto max-w-xl py-2 text-center sm:py-6">
            <h2 className="text-subtitle text-white">Five questions. Fifteen seconds each.</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[#c3bde3]">
              Programming, technology, general knowledge, patterns and riddles. A right answer scores 100, plus 5 for every
              second left on the clock.
            </p>
            <fieldset className="mx-auto mt-7 max-w-sm">
              <legend className="sr-only">Players</legend>
              <div className="grid grid-cols-2 gap-2.5">
                {([1, 2] as const).map((n) => (
                  <label
                    key={n}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-3 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#a99bff]",
                      players === n ? "border-[#8f7bff] bg-[#8f7bff]/15" : "border-white/15 hover:border-white/30",
                    )}
                  >
                    <input type="radio" name="clash-players" className="sr-only" checked={players === n} onChange={() => setPlayers(n)} />
                    {n === 1 ? <User aria-hidden className="size-5 text-[#a99bff]" /> : <Users aria-hidden className="size-5 text-[#a99bff]" />}
                    <span className="text-sm font-semibold">{n === 1 ? "Solo" : "Two players"}</span>
                    <span className="text-xs text-[#c3bde3]">{n === 1 ? "5 questions" : "Same device, take turns"}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="button" onClick={start} className={cn(solid, "mt-7")}>
              Start round
              <ArrowRight aria-hidden className="size-4" />
            </button>
            {best !== null && <p className="mt-4 text-sm text-[#c3bde3]">Your best solo score: {best}</p>}
          </div>
        )}

        {phase === "playing" && question && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-[#c3bde3]">
              <span>
                Question <span className="font-semibold text-white">{index + 1}</span> of {round.length}
              </span>
              {players === 2 && (
                <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", player === 0 ? "bg-[#4f6ff5]/25 text-[#c7d2ff]" : "bg-[#8b5cf6]/25 text-[#ddd0ff]")}>
                  Player {player + 1}&apos;s turn
                </span>
              )}
            </div>
            <div className="mb-5">
              <TimerBar left={left} total={CLASH_SECONDS} tone="clash" />
            </div>
            <QuestionCard
              ref={headingRef}
              tone="clash"
              choice={question}
              outcome={current?.outcome ?? null}
              onChoose={settle}
              label={players === 2 ? `${question.topic} · Player ${player + 1}` : question.topic}
              footer={
                <button ref={nextRef} type="button" onClick={advance} className={solid}>
                  {index + 1 < round.length ? (players === 2 ? `Pass to Player ${((index + 1) % 2) + 1}` : "Next question") : "See results"}
                  <ArrowRight aria-hidden className="size-4" />
                </button>
              }
            />
          </div>
        )}

        {phase === "done" && (
          <div className="mx-auto max-w-xl py-2 text-center motion-safe:animate-pop sm:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#a99bff]">Round over</p>
            {players === 1 ? (
              <>
                <h2 ref={resultRef} tabIndex={-1} className="mt-3 text-[3.25rem] font-semibold leading-none tracking-[-0.04em] outline-none">
                  {scores[0]}
                  <span className="sr-only"> points</span>
                </h2>
                <p className="mt-2 text-sm text-[#c3bde3]">
                  points · {results.filter((r) => r.points > 0).length} of {round.length} correct
                </p>
                <p className="mt-5 text-card">{clashAchievement(results.filter((r) => r.points > 0).length, round.length)}</p>
                <p className="mt-1 text-sm text-[#c3bde3]">
                  {previousBest === null || scores[0] > previousBest ? "A new best in this browser." : `Your best: ${previousBest}.`}
                </p>
              </>
            ) : (
              <>
                <h2 ref={resultRef} tabIndex={-1} className="text-subtitle mt-3 outline-none">
                  {{ "player-1": "Player 1 wins", "player-2": "Player 2 wins", tie: "It's a tie" }[clashWinner(scores)]}
                </h2>
                <dl className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-3">
                  {scores.map((s, i) => (
                    <div key={i} className="rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3">
                      <dt className="text-xs text-[#c3bde3]">Player {i + 1}</dt>
                      <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">{s}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={start} className={solid}>
                <RotateCcw aria-hidden className="size-4" />
                Play again
              </button>
              <button type="button" onClick={() => setPhase("intro")} className={quiet}>
                Change players
              </button>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#c3bde3]">
              <p>
                The full Brain Clash is a two-team, real-time game in{" "}
                <Link href="/projects/voxplay" className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                  VoxPlay
                </Link>
                .
              </p>
              <Link href="/#lab" className="mt-3 inline-flex items-center gap-1.5 font-medium text-white hover:underline">
                <ArrowLeft aria-hidden className="size-4" />
                Back to the portfolio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, RotateCcw, Timer, TimerOff } from "lucide-react";
import { challengeKindLabels, mindChallenges, type MindChallenge } from "@/content/lab";
import { answerPoints, MIND_SECONDS, mindAchievement, pickMindRound } from "@/lib/quiz";
import { useCountdown } from "@/lib/useCountdown";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { QuestionCard, TimerBar, type Outcome } from "./QuestionCard";

type Phase = "intro" | "playing" | "done";

interface Result {
  challenge: MindChallenge;
  outcome: Exclude<Outcome, null>;
  points: number;
}

/** Five short puzzles (sequence, logic, pattern, debugging, state), timed or relaxed, scored in the browser. */
export function DevelopersMind() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timed, setTimed] = useState(true);
  const [round, setRound] = useState<MindChallenge[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const [best, setBest] = useStoredNumber(`developers-mind-best-${timed ? "timed" : "relaxed"}`);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const challenge = round[index];
  const current = results[index];
  const outcome: Outcome = current?.outcome ?? null;
  const score = results.reduce((sum, r) => sum + r.points, 0);
  const correctCount = results.filter((r) => r.points > 0).length;

  const left = useCountdown(MIND_SECONDS, phase === "playing" && timed && !current, `${phase}-${index}-${round.length}`, () =>
    settle("timeout"),
  );

  function start() {
    setRound(pickMindRound(mindChallenges));
    setIndex(0);
    setResults([]);
    setPhase("playing");
  }

  function settle(next: Exclude<Outcome, null>) {
    if (!challenge || current) return;
    const correct = next === challenge.answer;
    setResults((prev) => [...prev, { challenge, outcome: next, points: answerPoints(correct, timed ? left : null, 2) }]);
  }

  function advance() {
    if (index + 1 < round.length) {
      setIndex(index + 1);
      return;
    }
    setPreviousBest(best);
    if (best === null || score > best) setBest(score);
    setPhase("done");
  }

  // Keyboard flow: focus the prompt for each new challenge, the Next button once answered, the score at the end.
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

  if (phase === "intro") {
    return (
      <div className="card mx-auto max-w-2xl rounded-xl p-6 sm:p-9">
        <span className="grid size-11 place-items-center rounded-lg border border-line bg-accent-soft text-accent">
          <Brain aria-hidden className="size-5" />
        </span>
        <h2 className="text-subtitle mt-6 text-fg">Think clearly. Solve the puzzle. Beat your best score.</h2>
        <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-2 text-[0.9375rem] leading-relaxed text-muted">
          <li>Five short challenges: a number sequence, a logic puzzle, a pattern, a bug and a state machine.</li>
          <li>Pick an answer with a tap, a click, Tab and Enter, or the keys 1–4.</li>
          <li>100 points per correct answer. In timed mode, each second left adds 2 more.</li>
          <li>Nothing is sent anywhere: your best score is only kept in this browser.</li>
        </ul>

        <fieldset className="mt-7">
          <legend className="text-sm font-medium text-fg">Mode</legend>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
            {[
              { value: true, label: "Timed", detail: `${MIND_SECONDS} seconds per challenge`, Icon: Timer },
              { value: false, label: "Relaxed", detail: "No timer, no time bonus", Icon: TimerOff },
            ].map(({ value, label, detail, Icon }) => (
              <label
                key={label}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                  timed === value ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong",
                )}
              >
                <input type="radio" name="mind-mode" className="sr-only" checked={timed === value} onChange={() => setTimed(value)} />
                <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", timed === value ? "text-accent" : "text-subtle")} />
                <span>
                  <span className="block text-sm font-semibold text-fg">{label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-subtle">{best !== null ? `Your best (${timed ? "timed" : "relaxed"}): ${best} points` : "No best score yet."}</p>
          <Button size="lg" onClick={start}>
            Play now
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const max = round.length * answerPoints(true, timed ? MIND_SECONDS : null, 2);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card rounded-xl p-6 text-center motion-safe:animate-pop sm:p-9">
          <p className="eyebrow">Results</p>
          <h2 ref={resultRef} tabIndex={-1} className="mt-3 text-[3.25rem] font-semibold leading-none tracking-[-0.04em] text-fg outline-none">
            {score}
            <span className="sr-only"> points</span>
          </h2>
          <p className="mt-2 text-sm text-subtle">
            points of a possible {max} · {correctCount} of {round.length} correct · {timed ? "timed" : "relaxed"} mode
          </p>
          <p className="mt-5 text-card text-fg">{mindAchievement(correctCount, round.length)}</p>
          <p className="mt-1 text-sm text-muted">
            {previousBest === null || score > previousBest ? "A new best in this browser. " : `Your best: ${previousBest}. `}
            Just for fun: it measures five puzzles, not anyone&apos;s engineering ability.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button onClick={start}>
              <RotateCcw aria-hidden className="size-4" />
              Play again
            </Button>
            <Button variant="secondary" onClick={() => setPhase("intro")}>
              Change mode
            </Button>
            <ButtonLink href="/#lab" variant="ghost">
              <ArrowLeft aria-hidden className="size-4" />
              Back to the portfolio
            </ButtonLink>
          </div>
        </div>

        <h3 className="text-card mt-10 text-fg">Your answers</h3>
        <ol className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3">
          {results.map((r, i) => (
            <li key={r.challenge.id} className="card rounded-lg p-4 text-[0.9375rem]">
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-medium text-fg">
                  {i + 1}. {challengeKindLabels[r.challenge.kind]}
                </span>
                <span className={cn("text-sm font-medium", r.points > 0 ? "text-success" : "text-danger")}>
                  {r.points > 0 ? `Correct · +${r.points}` : r.outcome === "timeout" ? "Time ran out · 0" : "Missed · 0"}
                </span>
              </p>
              <p className="mt-1 text-muted">Answer: {r.challenge.options[r.challenge.answer]}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (!challenge) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <span className="text-muted">
          Challenge <span className="font-semibold text-fg">{index + 1}</span> of {round.length}
        </span>
        <span className="text-muted">
          Score <span className="font-mono font-semibold text-fg tabular-nums">{score}</span>
        </span>
      </div>
      <ol className="mb-5 grid grid-cols-5 gap-1.5" aria-label="Progress">
        {round.map((c, i) => {
          const r = results[i];
          const state = r ? (r.points > 0 ? "correct" : "missed") : i === index ? "current" : "upcoming";
          return (
            <li
              key={c.id}
              className={cn(
                "h-1.5 rounded-full",
                state === "correct" && "bg-success",
                state === "missed" && "bg-danger",
                state === "current" && "bg-accent",
                state === "upcoming" && "bg-surface-3",
              )}
            >
              <span className="sr-only">
                Challenge {i + 1}: {state}
              </span>
            </li>
          );
        })}
      </ol>
      {timed && (
        <div className="mb-5">
          <TimerBar left={left} total={MIND_SECONDS} />
        </div>
      )}
      <QuestionCard
        ref={headingRef}
        choice={challenge}
        outcome={outcome}
        onChoose={settle}
        label={challengeKindLabels[challenge.kind]}
        footer={
          <Button ref={nextRef} onClick={advance}>
            {index + 1 < round.length ? "Next challenge" : "See results"}
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        }
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { bugChallenges } from "@/content/playground";
import { scoreLabel } from "@/lib/games";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GameIntro } from "./PlaygroundShell";

type Status = "choosing" | "retry" | "found" | "revealed";
const MAX_TRIES = 2;

export function BugHunter() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("choosing");
  const [wrongLines, setWrongLines] = useState<number[]>([]);
  const [firstTry, setFirstTry] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useStoredNumber("bug-hunter-best");
  const nextRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const challenge = bugChallenges[index];
  const resolved = status === "found" || status === "revealed";

  function start() {
    setStarted(true);
    setIndex(0);
    setStatus("choosing");
    setWrongLines([]);
    setFirstTry(0);
    setFinished(false);
  }

  function pick(lineNumber: number) {
    if (!challenge || resolved || wrongLines.includes(lineNumber)) return;
    if (lineNumber === challenge.bugLine) {
      setStatus("found");
      if (wrongLines.length === 0) setFirstTry((n) => n + 1);
      return;
    }
    const wrong = [...wrongLines, lineNumber];
    setWrongLines(wrong);
    setStatus(wrong.length >= MAX_TRIES ? "revealed" : "retry");
  }

  function next() {
    if (index + 1 < bugChallenges.length) {
      setIndex(index + 1);
      setStatus("choosing");
      setWrongLines([]);
    } else {
      if (best === null || firstTry > best) setBest(firstTry);
      setFinished(true);
    }
  }

  useEffect(() => {
    if (resolved) nextRef.current?.focus();
  }, [resolved]);
  useEffect(() => {
    if (started && !finished) titleRef.current?.focus();
  }, [index, started, finished]);

  if (!started) {
    return (
      <GameIntro
        title="Every snippet has exactly one buggy line"
        points={["Read the context, then select the line with the bug.", `You get ${MAX_TRIES} tries per snippet.`, "Points are for bugs found on the first try."]}
        best={best !== null ? `${best} / ${bugChallenges.length}` : null}
        onStart={start}
      />
    );
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-xl rounded-xl glass-card p-6 text-center shadow-sm sm:p-8" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-subtle">Found on the first try</p>
        <p className="mt-2 text-5xl font-semibold text-fg">
          {firstTry}
          <span className="text-2xl text-subtle"> / {bugChallenges.length}</span>
        </p>
        <p className="mt-2 text-muted">{scoreLabel(firstTry, bugChallenges.length)}</p>
        {best !== null && <p className="mt-1 font-mono text-xs text-subtle">Best: {best} / {bugChallenges.length}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={start}>
            <RotateCcw aria-hidden className="size-4" />
            Play again
          </Button>
          <ButtonLink href="/playground" variant="secondary">
            Back to the Lab
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-muted">
          Snippet <span className="font-mono text-fg">{index + 1}</span> of {bugChallenges.length}
        </span>
        <span className="font-mono text-subtle">First-try finds {firstTry}</span>
      </div>

      <div className="rounded-xl glass-card p-5 shadow-sm sm:p-6">
        <h2 ref={titleRef} tabIndex={-1} className="text-lg font-semibold text-fg outline-none sm:text-xl">
          {challenge.title}
        </h2>
        <p className="mt-1.5 text-muted">{challenge.context}</p>

        <div className="mt-5 overflow-hidden rounded-lg bg-code-bg">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[0.6875rem] text-[#8d9ab3]">
            <span>{challenge.language}</span>
            <span>{resolved ? "" : "Select the line with the bug"}</span>
          </div>
          <ol className="overflow-x-auto py-2 text-[0.8125rem] leading-relaxed">
            {challenge.lines.map((text, i) => {
              const lineNumber = i + 1;
              const isBug = lineNumber === challenge.bugLine;
              const isWrong = wrongLines.includes(lineNumber);
              const highlight = resolved && isBug;
              if (!text.trim()) {
                return <li key={lineNumber} aria-hidden className="h-[1.6em]" />;
              }
              return (
                <li key={lineNumber}>
                  <button
                    type="button"
                    disabled={resolved || isWrong}
                    onClick={() => pick(lineNumber)}
                    aria-label={`Line ${lineNumber}: ${text.trim()}`}
                    className={cn(
                      "flex w-full min-w-max items-start gap-4 px-4 py-0.5 text-left font-mono text-code-fg transition-colors",
                      !resolved && !isWrong && "hover:bg-white/[0.06] focus-visible:bg-white/[0.06]",
                      isWrong && "bg-[#f27b7b]/[0.12] text-[#f2a3a3] line-through decoration-[#f27b7b]/60",
                      highlight && "bg-[#45cf8f]/[0.14]",
                    )}
                  >
                    <span aria-hidden className="w-5 shrink-0 select-none text-right text-[#5d6a84]">
                      {lineNumber}
                    </span>
                    <span className="whitespace-pre">{text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div aria-live="polite" className="mt-5">
          {status === "retry" && <p className="font-medium text-warning">Not that line. One more try.</p>}
          {resolved && (
            <div className={cn("rounded-lg border p-4", status === "found" ? "border-success/40 bg-success-soft" : "border-line bg-surface-2")}>
              <p className={cn("font-semibold", status === "found" ? "text-success" : "text-fg")}>
                {status === "found" ? (wrongLines.length === 0 ? "Found it on the first try." : "Found it.") : `The bug is on line ${challenge.bugLine}.`}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg/90">{challenge.explanation}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.06em] text-subtle">Fix</p>
              <pre className="mt-1 overflow-x-auto rounded-md bg-code-bg px-3 py-2 text-[0.8125rem] text-code-fg">
                <code>{challenge.fix}</code>
              </pre>
              {challenge.origin && <p className="mt-3 text-sm italic text-muted">{challenge.origin}</p>}
            </div>
          )}
        </div>

        {resolved && (
          <div className="mt-5 flex justify-end">
            <Button ref={nextRef} onClick={next}>
              {index + 1 < bugChallenges.length ? "Next snippet" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

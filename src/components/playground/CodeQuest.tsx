import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { quizQuestions, type QuizQuestion } from "@/content/playground";
import { scoreLabel, shuffle } from "@/lib/games";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { GameIntro } from "./PlaygroundShell";

type Phase = "intro" | "playing" | "done";
interface Answer {
  question: QuizQuestion;
  chosen: number;
}

export function CodeQuest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [best, setBest] = useStoredNumber("code-quest-best");
  const nextRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);

  const question = order[index];
  const current = answers[index];
  const score = answers.filter((a) => a.chosen === a.question.answer).length;

  function start() {
    setOrder(shuffle(quizQuestions));
    setIndex(0);
    setAnswers([]);
    setPhase("playing");
  }

  function choose(option: number) {
    if (!question || current) return;
    setAnswers((prev) => [...prev, { question, chosen: option }]);
  }

  function next() {
    if (index + 1 < order.length) {
      setIndex(index + 1);
    } else {
      if (best === null || score > best) setBest(score);
      setPhase("done");
    }
  }

  // Keyboard flow: after answering, focus moves to "Next"; on a new question, to the question itself.
  useEffect(() => {
    if (current) nextRef.current?.focus();
  }, [current]);
  useEffect(() => {
    if (phase === "playing") questionRef.current?.focus();
  }, [index, phase]);

  if (phase === "intro") {
    return (
      <GameIntro
        title={`Ready for ${quizQuestions.length} questions?`}
        points={["One answer per question, then an explanation.", "No timer: take your time.", "Your best score is remembered in this browser."]}
        best={best !== null ? `${best} / ${quizQuestions.length}` : null}
        onStart={start}
      />
    );
  }

  if (phase === "done") {
    const missed = answers.filter((a) => a.chosen !== a.question.answer);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl card p-6 text-center shadow-sm sm:p-8" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-subtle">Final score</p>
          <p className="mt-2 text-5xl font-semibold text-fg">
            {score}
            <span className="text-2xl text-subtle"> / {order.length}</span>
          </p>
          <p className="mt-2 text-muted">{scoreLabel(score, order.length)}</p>
          {best !== null && <p className="mt-1 font-mono text-xs text-subtle">Best: {best} / {order.length}</p>}
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
        {missed.length > 0 && (
          <section aria-labelledby="review-title" className="mt-8">
            <h2 id="review-title" className="text-lg font-semibold text-fg">
              Review the ones you missed
            </h2>
            <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3">
              {missed.map(({ question: q }) => (
                <li key={q.id} className="rounded-lg card p-4">
                  <p className="font-medium text-fg">{q.prompt}</p>
                  <p className="mt-1 text-sm text-success">Answer: {q.options[q.answer]}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{q.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (!question) return null;
  const answered = Boolean(current);
  const correct = current?.chosen === question.answer;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted">
          Question <span className="font-mono text-fg">{index + 1}</span> of {order.length}
        </span>
        <span className="font-mono text-subtle">Score {score}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${((index + (answered ? 1 : 0)) / order.length) * 100}%` }} />
      </div>

      <div className="mt-6 rounded-xl card p-5 shadow-sm sm:p-6">
        <p className="text-xs font-medium text-subtle">{question.topic}</p>
        <h2 ref={questionRef} tabIndex={-1} className="mt-3 text-lg font-semibold leading-snug text-fg outline-none sm:text-xl">
          {question.prompt}
        </h2>
        {question.code && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-code-bg p-4 text-[0.8125rem] leading-relaxed text-code-fg">
            <code>{question.code}</code>
          </pre>
        )}

        <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-2">
          {question.options.map((option, i) => {
            const isAnswer = i === question.answer;
            const isChosen = current?.chosen === i;
            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-[0.9375rem] transition-colors",
                    !answered && "border-line bg-bg text-fg hover:border-accent-line hover:bg-accent-soft",
                    answered && isAnswer && "border-success bg-success-soft text-fg",
                    answered && isChosen && !isAnswer && "border-danger bg-danger-soft text-fg",
                    answered && !isAnswer && !isChosen && "border-line bg-bg text-subtle",
                  )}
                >
                  <span className="grid grid-cols-[minmax(0,1fr)] size-6 shrink-0 place-items-center rounded-md border border-line-strong font-mono text-xs">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 font-mono text-[0.875rem]">{option}</span>
                  {answered && isAnswer && <Check aria-label="Correct answer" className="size-4 text-success" />}
                  {answered && isChosen && !isAnswer && <X aria-label="Your answer" className="size-4 text-danger" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite">
          {answered && (
            <div className={cn("mt-5 rounded-lg border p-4", correct ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft")}>
              <p className={cn("font-semibold", correct ? "text-success" : "text-danger")}>{correct ? "Correct." : "Not quite."}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg/90">{question.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <div className="mt-5 flex justify-end">
            <Button ref={nextRef} onClick={next}>
              {index + 1 < order.length ? "Next question" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

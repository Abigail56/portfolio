import { forwardRef, type KeyboardEvent, type ReactNode } from "react";
import { Check, Clock, X } from "lucide-react";
import type { Choice } from "@/content/lab";
import { cn } from "@/lib/cn";

/** What happened to the current question: not answered yet, an option index, or the timer ran out. */
export type Outcome = null | number | "timeout";

export type CardTone = "site" | "clash";

const tones: Record<CardTone, { card: string; option: string; idle: string; muted: string; code: string; key: string }> = {
  site: {
    card: "card rounded-xl",
    option: "border-line bg-bg text-fg hover:border-accent-line hover:bg-accent-soft",
    idle: "border-line bg-bg text-subtle",
    muted: "text-muted",
    code: "bg-code-bg text-code-fg",
    key: "border-line-strong text-muted",
  },
  clash: {
    card: "rounded-xl border border-white/10 bg-white/[0.04]",
    option: "border-white/12 bg-white/[0.03] text-white hover:border-[#8f7bff] hover:bg-[#8f7bff]/12",
    idle: "border-white/10 bg-transparent text-[#a9a3c9]",
    muted: "text-[#c3bde3]",
    code: "bg-black/40 text-[#ece9ff]",
    key: "border-white/25 text-[#c3bde3]",
  },
};

interface QuestionCardProps {
  choice: Choice;
  outcome: Outcome;
  onChoose: (index: number) => void;
  /** Small label above the prompt, such as the challenge type. */
  label: ReactNode;
  tone?: CardTone;
  /** Rendered under the feedback once the question is settled (the Next button). */
  footer?: ReactNode;
}

/**
 * One multiple-choice question. Options are real buttons (keyboard and touch), and the keys 1–4 or A–D also
 * answer while focus is inside the card. Feedback is spoken through a live region and never relies on colour
 * alone: each settled option is marked with an icon and text.
 */
export const QuestionCard = forwardRef<HTMLHeadingElement, QuestionCardProps>(function QuestionCard(
  { choice, outcome, onChoose, label, tone = "site", footer },
  headingRef,
) {
  const t = tones[tone];
  const settled = outcome !== null;
  const correct = typeof outcome === "number" && outcome === choice.answer;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (settled || e.altKey || e.ctrlKey || e.metaKey) return;
    const key = e.key.toLowerCase();
    const index = /^[1-4]$/.test(key) ? Number(key) - 1 : "abcd".indexOf(key);
    if (index >= 0 && index < choice.options.length) {
      e.preventDefault();
      onChoose(index);
    }
  }

  return (
    <div className={cn(t.card, "p-5 sm:p-7")} onKeyDown={onKeyDown}>
      <p className={cn("text-xs font-semibold uppercase tracking-[0.08em]", t.muted)}>{label}</p>
      <h2 ref={headingRef} tabIndex={-1} className={cn("text-subtitle mt-3 outline-none", tone === "site" ? "text-fg" : "text-white")}>
        {choice.prompt}
      </h2>
      {choice.code && (
        <pre className={cn("mt-5 overflow-x-auto rounded-lg p-4 text-[0.8125rem] leading-relaxed", t.code)}>
          <code>{choice.code}</code>
        </pre>
      )}

      <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
        {choice.options.map((option, i) => {
          const isAnswer = i === choice.answer;
          const isChosen = outcome === i;
          return (
            <li key={option}>
              <button
                type="button"
                disabled={settled}
                onClick={() => onChoose(i)}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-[0.9375rem] leading-snug transition-colors duration-150",
                  !settled && t.option,
                  settled && isAnswer && (tone === "clash" ? "border-[#4ade80] bg-[#4ade80]/10 text-white" : "border-success bg-success-soft text-fg"),
                  settled && isChosen && !isAnswer && (tone === "clash" ? "border-[#fb7185] bg-[#fb7185]/10 text-white" : "border-danger bg-danger-soft text-fg"),
                  settled && !isAnswer && !isChosen && t.idle,
                )}
              >
                <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-md border font-mono text-xs", t.key)}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {settled && isAnswer && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                    <Check aria-hidden className="size-4" />
                    Answer
                  </span>
                )}
                {settled && isChosen && !isAnswer && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                    <X aria-hidden className="size-4" />
                    Your pick
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" aria-atomic="true">
        {settled && (
          <div className="mt-6 motion-safe:animate-fade-up">
            <p className={cn("inline-flex items-center gap-2 font-semibold", correct ? (tone === "clash" ? "text-[#4ade80]" : "text-success") : tone === "clash" ? "text-[#fda4af]" : "text-danger")}>
              {correct ? <Check aria-hidden className="size-4" /> : outcome === "timeout" ? <Clock aria-hidden className="size-4" /> : <X aria-hidden className="size-4" />}
              {correct ? "Correct." : outcome === "timeout" ? `Time's up. The answer was ${choice.options[choice.answer]}.` : `Not quite. The answer was ${choice.options[choice.answer]}.`}
            </p>
            <p className={cn("mt-1.5 text-[0.9375rem] leading-relaxed", t.muted)}>{choice.explanation}</p>
          </div>
        )}
      </div>
      {settled && footer && <div className="mt-6 flex flex-wrap items-center justify-end gap-3">{footer}</div>}
    </div>
  );
});

/** A slim countdown bar with the seconds as text, so the time left doesn't depend on reading the bar. */
export function TimerBar({ left, total, tone = "site" }: { left: number; total: number; tone?: CardTone }) {
  const low = left <= 5;
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-1.5 flex-1 overflow-hidden rounded-full", tone === "clash" ? "bg-white/10" : "bg-surface-3")} aria-hidden>
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-linear",
            low ? (tone === "clash" ? "bg-[#fb7185]" : "bg-danger") : tone === "clash" ? "bg-gradient-to-r from-[#5b7cfa] to-[#a77bff]" : "bg-accent",
          )}
          style={{ width: `${(left / total) * 100}%` }}
        />
      </div>
      <span className={cn("w-12 text-right font-mono text-sm tabular-nums", low ? (tone === "clash" ? "text-[#fda4af]" : "text-danger") : tone === "clash" ? "text-[#c3bde3]" : "text-muted")}>
        {left}s<span className="sr-only"> left</span>
      </span>
    </div>
  );
}

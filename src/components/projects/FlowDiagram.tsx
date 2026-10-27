import { Fragment } from "react";
import { ArrowRight, CornerDownRight } from "lucide-react";
import type { Flow } from "@/lib/types";
import { cn } from "@/lib/cn";

const chip = "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[0.8125rem] leading-5";

/**
 * A lifecycle as an ordered list: the main path as a wrapping row, then the transitions that leave it.
 * Plain HTML, so screen readers get the steps in order and the text is selectable.
 */
export function FlowDiagram({ flow, compact }: { flow: Flow; compact?: boolean }) {
  const last = flow.steps.length - 1;
  return (
    <figure>
      {!compact && <p className="text-card text-fg">{flow.title}</p>}
      <ol
        aria-label={`${flow.title}: main path`}
        className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2.5 sm:gap-x-2", !compact && "mt-4")}
      >
        {flow.steps.map((step, i) => (
          <Fragment key={step}>
            <li className={cn(chip, i === last ? "border-accent-line bg-accent-soft text-accent" : "border-line bg-surface text-fg")}>{step}</li>
            {i < last && (
              <li aria-hidden className="text-subtle">
                <ArrowRight className="size-3.5" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>

      {flow.branches && flow.branches.length > 0 && (
        <ul aria-label="Other transitions" className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 border-t border-dashed border-line pt-4">
          {flow.branches.map((b) => (
            <li key={b.from} className="flex flex-wrap items-center gap-2">
              <CornerDownRight aria-hidden className="size-3.5 text-subtle" />
              <span className={cn(chip, "border-line bg-surface-2 text-fg")}>{b.from}</span>
              <ArrowRight aria-hidden className="size-3.5 text-subtle" />
              <span className="sr-only">can move to</span>
              {b.to.map((t, i) => (
                <Fragment key={t}>
                  {i > 0 && <span className="text-meta text-subtle">or</span>}
                  <span className={cn(chip, "border-line bg-surface-2 text-fg")}>{t}</span>
                </Fragment>
              ))}
            </li>
          ))}
        </ul>
      )}

      {(flow.note || !compact) && (
        <figcaption className="text-meta mt-4 text-muted">
          {flow.note && <span className="block">{flow.note}</span>}
          {!compact && <span className="mt-1 block text-subtle">{flow.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

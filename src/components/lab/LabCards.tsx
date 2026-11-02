import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { games } from "@/content/games";
import { ButtonLink } from "@/components/ui/Button";

const mind = games.find((g) => g.id === "developers-mind")!;
const clash = games.find((g) => g.id === "brain-clash")!;

/**
 * The two featured games as cards. Only links live here; each game's code loads on its own page, so the
 * portfolio pages carry none of it.
 */
export function LabCards() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
      <article data-reveal className="card flex flex-col rounded-xl p-5 sm:p-7">
        <div aria-hidden className="rounded-xl border border-line bg-surface-2 p-5 font-mono text-sm">
          <div className="flex items-center justify-between text-xs text-subtle">
            <span>Challenge 1 of 5 · Sequence</span>
            <span className="tabular-nums">45s</span>
          </div>
          <p className="mt-4 text-lg tracking-tight text-fg">
            2, 6, 12, 20, 30, <span className="rounded bg-accent-soft px-1.5 text-accent">?</span>
          </p>
          <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-xs">
            {["36", "40", "42", "44"].map((n) => (
              <span key={n} className="rounded-md border border-line bg-surface py-1.5 text-muted">
                {n}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-subtitle mt-6 text-fg">{mind.name}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{mind.summary}</p>
        <p className="text-meta mt-3 text-subtle">{mind.meta}</p>
        <div className="mt-auto pt-6">
          <ButtonLink href={`/playground/${mind.id}`} className="group">
            Play now
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="sr-only">: {mind.name}</span>
          </ButtonLink>
        </div>
      </article>

      <article data-reveal style={{ transitionDelay: "80ms" }} className="card flex flex-col rounded-xl p-5 sm:p-7">
        <div aria-hidden className="rounded-xl border border-line bg-surface-2 p-5 text-sm">
          <div className="flex items-center justify-between text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-accent" />
              Riddles · Question 3 of 5
            </span>
            <span className="font-mono tabular-nums">12s</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full w-4/5 rounded-full bg-accent-solid" />
          </div>
          <p className="mt-4 font-medium leading-snug text-fg">The more you take, the more you leave behind. What are they?</p>
          <div className="mt-4 grid grid-cols-2 gap-1.5 text-xs">
            {["Photos", "Footsteps", "Breaths", "Notes"].map((n) => (
              <span key={n} className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-muted">
                {n}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-subtitle mt-6 text-fg">{clash.name}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{clash.summary}</p>
        <p className="text-meta mt-3 text-subtle">{clash.meta}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
          <ButtonLink href={`/playground/${clash.id}`} className="group">
            Play now
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="sr-only">: {clash.name}</span>
          </ButtonLink>
          <Link href="/projects/voxplay" className="link-arrow">
            Explore VoxPlay
          </Link>
        </div>
      </article>
    </div>
  );
}

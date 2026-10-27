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
      <article data-reveal className="card flex flex-col rounded-2xl p-5 sm:p-7">
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

      <article
        data-reveal
        style={{ transitionDelay: "80ms" }}
        className="flex flex-col rounded-2xl border border-[#2a2257] bg-[#120e2b] p-5 text-white [background-image:radial-gradient(120%_80%_at_100%_0%,rgb(124_92_255/0.2),transparent_60%)] sm:p-7"
      >
        <div aria-hidden className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm">
          <div className="flex items-center justify-between text-xs text-[#c3bde3]">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="size-3.5 text-[#a99bff]" />
              Riddles · Question 3 of 5
            </span>
            <span className="font-mono tabular-nums">12s</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#5b7cfa] to-[#a77bff]" />
          </div>
          <p className="mt-4 font-medium leading-snug">The more you take, the more you leave behind. What are they?</p>
          <div className="mt-4 grid grid-cols-2 gap-1.5 text-xs">
            {["Photos", "Footsteps", "Breaths", "Notes"].map((n) => (
              <span key={n} className="rounded-md border border-white/12 px-2.5 py-1.5 text-[#d9d4f5]">
                {n}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-subtitle mt-6">{clash.name}</h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[#c3bde3]">{clash.summary}</p>
        <p className="text-meta mt-3 text-[#a9a3c9]">{clash.meta}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
          <Link
            href={`/playground/${clash.id}`}
            className="group inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-[#4f6ff5] to-[#8b5cf6] px-4 text-sm font-medium text-white transition-[filter] hover:brightness-110 focus-visible:outline-[#a99bff]"
          >
            Play now
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="sr-only">: {clash.name}</span>
          </Link>
          <Link href="/projects/voxplay" className="text-sm font-medium text-[#d9d4f5] underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white">
            Explore VoxPlay
          </Link>
        </div>
      </article>
    </div>
  );
}

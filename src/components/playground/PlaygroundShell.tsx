import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { games, type GameInfo } from "@/content/games";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

/** The frame around every game: a clear way out, the game itself, and links to the others. */
export function PlaygroundShell({ game, children }: { game: GameInfo; children: ReactNode }) {
  return (
    <>
      <header>
        <Container className="pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link href="/playground" className="inline-flex items-center gap-1.5 text-muted hover:text-fg">
              <ArrowLeft aria-hidden className="size-4" />
              Interactive Lab
            </Link>
            <Link href="/" className="text-muted hover:text-fg">
              Back to the portfolio
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-title text-fg">{game.name}</h1>
              <p className="measure mt-3 text-muted">{game.detail}</p>
            </div>
            <p className="text-meta text-subtle">{game.meta}</p>
          </div>
        </Container>
      </header>
      <Container className="pb-10">
        {children}
        <nav aria-label="Other games" className="mt-12 border-t border-line pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {games.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/playground/${g.id}`}
                  aria-current={g.id === game.id ? "page" : undefined}
                  className={cn(
                    "text-meta underline-offset-4",
                    g.id === game.id ? "font-medium text-fg" : "text-muted hover:text-fg hover:underline",
                  )}
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}

/** The opening card of a game, shown before anything random happens (so server and browser render the same). */
export function GameIntro({ title, points, onStart, best }: { title: string; points: string[]; onStart: () => void; best?: string | null }) {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-line p-6 text-center sm:p-8">
      <h2 className="text-xl font-semibold text-fg">{title}</h2>
      <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-1.5 text-sm text-muted">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {best && <p className="mt-4 font-mono text-xs text-subtle">Your best: {best}</p>}
      <button
        type="button"
        onClick={onStart}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-accent-solid px-5 font-medium text-on-accent shadow-sm hover:bg-accent-solid-hover"
      >
        Start
      </button>
    </div>
  );
}

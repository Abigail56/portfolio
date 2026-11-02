import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { LabCards } from "@/components/lab/LabCards";
import { Container, PageHeader, SectionLabel } from "@/components/ui/Section";
import { games } from "@/content/games";

const experiments = games.filter((g) => g.kind === "experiment");
const more = games.filter((g) => !g.featured && g.kind !== "experiment");

export default function LabPage() {
  return (
    <>
      <Seo
        title="Interactive Lab"
        description="Interactive engineering experiments on state machines, safe retries and rate limiting, plus browser games, by Chukwu Chinecherem."
      />
      <PageHeader
        eyebrow="Interactive Lab"
        title="Engineering ideas you can try"
        lead="Small experiments based on problems from my projects, and a few games. Everything runs in your browser; nothing you do here is sent anywhere, and best scores stay on your device."
      />
      <Container className="mt-12 lg:mt-16">
        <section aria-labelledby="experiments-title">
          <SectionLabel id="experiments-title">Engineering experiments</SectionLabel>
          <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
            {experiments.map((game) => (
              <li key={game.id} data-reveal className="card group relative flex flex-col rounded-xl p-6 transition-colors hover:border-accent-line">
                <h3 className="text-card text-fg group-hover:text-accent">
                  <Link href={`/playground/${game.id}`} className="after:absolute after:inset-0 after:content-['']">
                    {game.name}
                  </Link>
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.65] text-muted">{game.summary}</p>
                <p className="text-meta mt-auto pt-4 font-mono text-subtle">{game.meta}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="games-title" className="mt-16 lg:mt-20">
          <SectionLabel id="games-title">Games</SectionLabel>
          <div className="mt-6">
            <LabCards />
          </div>
        </section>

        <section aria-labelledby="more-experiments" className="mt-16 lg:mt-20">
          <SectionLabel id="more-experiments">More to explore</SectionLabel>
          <ul className="mt-2">
            {more.map((game) => (
              <li
                key={game.id}
                className="group relative grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-line py-5 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
              >
                <h3 className="text-card text-fg">
                  <Link href={`/playground/${game.id}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent">
                    {game.name}
                  </Link>
                </h3>
                <div>
                  <p className="text-[0.9375rem] leading-relaxed text-muted">{game.summary}</p>
                  <p className="text-meta mt-1 text-subtle">{game.meta}</p>
                </div>
                <ArrowRight aria-hidden className="hidden size-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg sm:block" />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}

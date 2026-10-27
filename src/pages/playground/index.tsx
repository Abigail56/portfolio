import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { LabCards } from "@/components/lab/LabCards";
import { Container, PageHeader, SectionLabel } from "@/components/ui/Section";
import { games } from "@/content/games";

const more = games.filter((g) => !g.featured);

export default function LabPage() {
  return (
    <>
      <Seo
        title="The Lab"
        description="Small experiments: The Developer's Mind puzzle game, Brain Clash Mini, and a few more browser games by Chukwu Chinecherem."
      />
      <PageHeader
        eyebrow="The Lab"
        title="Small experiments. Big curiosity."
        lead="Short games that run entirely in your browser. Nothing is sent anywhere; best scores stay on your device."
      />
      <Container className="mt-12 lg:mt-16">
        <LabCards />

        <section aria-labelledby="more-experiments" className="mt-16 lg:mt-20">
          <SectionLabel id="more-experiments">More experiments</SectionLabel>
          <ul className="mt-2">
            {more.map((game) => (
              <li
                key={game.id}
                className="group relative grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-line py-5 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
              >
                <h2 className="text-card text-fg">
                  <Link href={`/playground/${game.id}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent">
                    {game.name}
                  </Link>
                </h2>
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

import Link from "next/link";
import { BookOpenCheck, Download, ListChecks, ShieldAlert } from "lucide-react";
import { SkillGroups } from "@/components/home/SkillGroups";
import { Seo } from "@/components/layout/Seo";
import { ButtonLink } from "@/components/ui/Button";
import { Portrait } from "@/components/ui/Portrait";
import { Container, SectionHeader } from "@/components/ui/Section";
import { site } from "@/config/site";
import { aboutParagraphs, languages, principles, timeline } from "@/content/profile";

const principleIcons = [ListChecks, ShieldAlert, BookOpenCheck];

export default function AboutPage() {
  return (
    <>
      <Seo title="About" description="Chukwu Chinecherem: background, toolkit and experience." />

      <Container className="pt-14 sm:pt-20">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-14">
          <Portrait sizes="224px" className="mx-auto w-full max-w-[14rem]" />
          <div>
            <p className="eyebrow">About</p>
            <h1 className="text-title mt-3 text-fg">{site.person.name}</h1>
            <p className="mt-2 text-muted">
              {site.person.role} · {site.person.location}
            </p>
            <div className="prose-body text-lead measure mt-6 text-fg">
              {aboutParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={site.cv.viewHref} variant="secondary" size="sm">
                View CV
              </ButtonLink>
              <ButtonLink href={site.cv.href} download={site.cv.fileName} variant="secondary" size="sm">
                <Download aria-hidden className="size-4" />
                Download CV
              </ButtonLink>
              <span className="text-sm text-muted">Languages: {languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}</span>
            </div>
          </div>
        </div>
      </Container>

      <Container className="section-gap mt-20 grid grid-cols-[minmax(0,1fr)] lg:mt-24">
        <section id="principles" aria-labelledby="principles-title" className="scroll-mt-24">
          <SectionHeader id="principles-title" eyebrow="How I work" title="Engineering principles" />
          <ol className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
            {principles.map((p, i) => {
              const Icon = principleIcons[i % principleIcons.length]!;
              return (
                <li key={p.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="card flex flex-col rounded-xl p-6">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="text-card mt-5 text-fg">{p.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.65] text-muted">{p.detail}</p>
                  <div className="mt-auto pt-5">
                    <p className="text-meta border-t border-line pt-4 text-muted">
                      <Link href={p.evidence.href} className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
                        {p.evidence.text}
                      </Link>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section id="toolkit" aria-labelledby="toolkit-title" className="scroll-mt-24">
          <SectionHeader id="toolkit-title" eyebrow="Toolkit" title="What I work with" />
          <SkillGroups className="mt-8" />
        </section>

        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24">
          <SectionHeader id="experience-title" eyebrow="Experience" title="Training, work and education" />
          <ol className="card mt-8 rounded-2xl">
            {timeline.map((entry) => (
              <li key={entry.title} className="grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-line p-6 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <p className="text-sm text-subtle">{entry.period}</p>
                <div>
                  <h3 className="text-card text-fg">{entry.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {entry.organisation}
                    {entry.location && `, ${entry.location}`}
                  </p>
                  {entry.points[0] && <p className="mt-2 text-sm leading-relaxed text-muted">{entry.points[0]}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}

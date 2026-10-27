import { Download } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { ButtonLink } from "@/components/ui/Button";
import { Portrait } from "@/components/ui/Portrait";
import { Container, SectionHeader } from "@/components/ui/Section";
import { site } from "@/config/site";
import { aboutParagraphs, languages, skillGroups, timeline } from "@/content/profile";

export default function AboutPage() {
  return (
    <>
      <Seo title="About" description="Chukwu Chinecherem: background, toolkit and experience." />

      <Container className="pt-14 sm:pt-20">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-14">
          <Portrait sizes="224px" className="mx-auto w-full max-w-[14rem]" />
          <div>
            <p className="eyebrow">About</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-fg sm:text-4xl">{site.person.name}</h1>
            <p className="mt-1 text-muted">
              {site.person.role} · {site.person.location}
            </p>
            <div className="prose-body mt-6 max-w-2xl leading-relaxed text-fg">
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

      <Container className="mt-24 grid grid-cols-[minmax(0,1fr)] gap-24">
        <section id="toolkit" aria-labelledby="toolkit-title" className="scroll-mt-24">
          <SectionHeader id="toolkit-title" eyebrow="Toolkit" title="What I work with" />
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.id} data-reveal className="rounded-2xl glass-card p-6">
                <h3 className="font-semibold text-fg">{group.label}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((s) => (
                    <li key={s.name} className="rounded-md bg-surface-2 px-2.5 py-1 text-sm text-fg">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24">
          <SectionHeader id="experience-title" eyebrow="Experience" title="Training, work and education" />
          <ol className="mt-8 rounded-2xl glass-card">
            {timeline.map((entry) => (
              <li key={entry.title} className="grid grid-cols-[minmax(0,1fr)] gap-1 border-b border-line p-6 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <p className="text-sm text-subtle">{entry.period}</p>
                <div>
                  <h3 className="font-semibold text-fg">{entry.title}</h3>
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

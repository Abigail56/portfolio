import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { SkillGroups } from "@/components/home/SkillGroups";
import { CopyButton } from "@/components/contact/CopyButton";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeader } from "@/components/ui/Section";
import { games } from "@/content/games";
import { selectedProjects } from "@/content/projects";
import { aboutFacts, aboutParagraphs, focusAreas } from "@/content/profile";
import { site } from "@/config/site";

const experiments = games.filter((g) => g.kind === "experiment");

// Structured data for search engines: only facts that appear on the page.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.person.name,
  jobTitle: site.person.role,
  email: `mailto:${site.contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Port Harcourt", addressCountry: "NG" },
  sameAs: [site.links.github, site.links.linkedin],
  ...(site.url && { url: site.url }),
  ...(site.url && site.photo.src && { image: `${site.url}${site.photo.src}` }),
};

const contactLink =
  "group flex min-h-12 items-center gap-3 border-b border-line py-3 text-sm font-medium text-fg transition-colors hover:text-accent";

export default function OverviewPage() {
  return (
    <>
      <Seo jsonLd={personJsonLd} />
      <Hero />

      <Container className="py-16 lg:py-24">
        <section aria-labelledby="work-title" id="work" className="scroll-mt-24">
          <SectionHeader
            id="work-title"
            eyebrow="Selected work"
            title="Real software, with its status stated plainly"
            lead="Five full-stack products, each with a case study covering the problem, the architecture and the decisions behind it."
            action={
              <Link href="/projects" className="link-arrow">
                All projects
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-12 lg:gap-10">
            {selectedProjects.map((project, i) => (
              <ProjectShowcase key={project.slug} project={project} index={i} />
            ))}
          </div>
        </section>

      </Container>

      <div className="border-y border-line bg-surface-2">
        <Container className="section-gap grid grid-cols-[minmax(0,1fr)] py-16 lg:py-24">
        <section aria-labelledby="about-title" id="about" className="scroll-mt-24">
          <div data-reveal className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <p className="eyebrow">About</p>
              <h2 id="about-title" className="text-title mt-3 text-fg">
                From Building Technology to building software
              </h2>
            </div>
            <div>
              <div className="prose-body measure text-lead text-muted">
                {aboutParagraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Areas of focus">
                {focusAreas.map((area) => (
                  <li key={area} className="tag">
                    {area}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-3">
                {aboutFacts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-meta text-subtle">{f.label}</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="link-arrow mt-8">
                More about how I work
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="skills-title" id="skills" className="scroll-mt-24">
          <SectionHeader id="skills-title" eyebrow="Technical skills" title="What I build with" />
          <SkillGroups className="mt-8 lg:mt-10" />
        </section>

        </Container>
      </div>

      <Container className="py-16 lg:py-24">
        <section aria-labelledby="experience-title" id="experience" className="scroll-mt-24">
          <SectionHeader id="experience-title" eyebrow="Background" title="Experience and education" />
          <div className="mt-8 lg:mt-10">
            <Experience />
          </div>
        </section>

      </Container>

      <div className="border-y border-line bg-surface-2">
        <Container className="py-16 lg:py-24">
        <section aria-labelledby="lab-title" id="lab" className="scroll-mt-24">
          <SectionHeader
            id="lab-title"
            eyebrow="Interactive Lab"
            title="Engineering ideas you can try"
            lead="Small working experiments based on problems from my projects. They run in your browser."
            action={
              <Link href="/playground" className="link-arrow">
                Explore the Lab
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] border-t border-line md:grid-cols-3 lg:mt-10">
            {experiments.map((game) => (
              <li key={game.id} data-reveal className="group relative border-b border-line py-6 md:pr-8">
                <h3 className="text-card text-fg transition-colors group-hover:text-accent">
                  <Link href={`/playground/${game.id}`} className="after:absolute after:inset-0 after:content-['']">
                    {game.name}
                  </Link>
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-[1.65] text-muted">{game.summary}</p>
                <p className="text-meta mt-3 font-mono text-subtle">{game.meta}</p>
              </li>
            ))}
          </ul>
        </section>

        </Container>
      </div>

      <Container className="pt-16 lg:pt-24">
        <section data-reveal aria-labelledby="contact-title" id="contact" className="card scroll-mt-24 rounded-xl px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title" className="text-title mt-3 text-fg">
                Let&apos;s talk about your team or project
              </h2>
              <p className="text-lead mt-4 max-w-[34rem] text-muted">
                I&apos;m looking for software engineering internships and junior developer roles, and I&apos;m glad to hear from engineering teams and collaborators.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="lg">
                  <Mail aria-hidden className="size-4" />
                  Send a message
                </ButtonLink>
                <CopyButton value={site.contact.email} label="Copy email address" text="Copy email" />
              </div>
            </div>
            <ul className="grid grid-cols-[minmax(0,1fr)]" aria-label="Other ways to reach me">
              <li>
                <a href={`mailto:${site.contact.email}`} className={contactLink}>
                  <Mail aria-hidden className="size-5 shrink-0 text-muted" />
                  <span className="min-w-0 break-words">{site.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <LinkedInIcon className="size-5 shrink-0 text-muted" />
                  LinkedIn
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <GitHubIcon className="size-5 shrink-0 text-muted" />
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="flex min-h-12 items-center gap-3 py-3 text-sm font-medium text-fg">
                <MapPin aria-hidden className="size-5 shrink-0 text-muted" />
                {site.person.location}
              </li>
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}

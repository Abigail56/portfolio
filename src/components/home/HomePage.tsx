"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { CopyButton } from "@/components/contact/CopyButton";
import { ContactForm } from "@/components/contact/ContactForm";
import { Seo } from "@/components/layout/Seo";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Container, SectionHeader } from "@/components/ui/Section";
import { aboutFacts, aboutParagraphs, focusAreas } from "@/content/profile";
import { projects, selectedProjects } from "@/content/projects";
import { site } from "@/config/site";
import { Hero } from "./Hero";
import { SkillGroups } from "./SkillGroups";
import { HomeIntro } from "./HomeIntro";
import { ProjectCard } from "@/components/projects/ProjectCard";

const contactLink =
  "group flex min-h-12 items-center gap-3 border-b border-line py-3 text-sm font-medium text-fg transition-colors hover:text-accent";

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

export function HomePage() {
  const [projectFilter, setProjectFilter] = useState<"all" | "full-stack" | "frontend">("all");
  const visibleProjects =
    projectFilter === "all"
      ? selectedProjects
      : projects.filter((project) => project.category === projectFilter);

  return (
    <>
      <HomeIntro />
      <Seo jsonLd={personJsonLd} />
      <Hero />

      <Container className="py-16 sm:py-20 lg:py-28">
        <section id="about" aria-labelledby="about-title" className="scroll-mt-24">
          <div data-reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <div>
              <p className="eyebrow">Editorial identity</p>
              <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle">Port Harcourt · Nigeria</p>
              <p className="mt-3 text-5xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">01</p>
              <p className="mt-3 max-w-[18rem] text-sm leading-7 text-muted">
                Building technology taught me to think in systems. Software lets me turn those systems into useful products.
              </p>
            </div>

            <div>
              <p className="eyebrow">About me</p>
              <h2 id="about-title" className="text-title mt-3 text-fg">
                From the built environment to building better software.
              </h2>
              <div className="prose-body text-lead measure mt-5 text-muted">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <h3 className="mt-7 text-card text-fg">What I Do</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="What I do">
                {focusAreas.map((area) => (
                  <li key={area} className="tag">
                    {area}
                  </li>
                ))}
              </ul>
              <dl className="mt-7 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-3">
                {aboutFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-meta text-subtle">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-fg">
                      {fact.value}
                      {fact.label === "Certification" && (
                        <a
                          href="/images/apf-hackathon-2026-certificate.jpeg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs font-semibold text-accent underline underline-offset-4"
                        >
                          View certificate
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="link-arrow mt-7">
                More about how I work
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </Container>

      <div className="border-y border-line bg-surface-2/55">
        <Container className="py-16 sm:py-20 lg:py-28">
          <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24">
            <SectionHeader
              id="projects-title"
              eyebrow="System → Product showcase"
              title="Featured case studies"
              lead="Conceptual implementations that turn engineering constraints into real, usable products."
              action={
                <Link href="/projects" className="link-arrow">
                  All projects
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              }
            />
            <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
              {([
                ["all", "All projects"],
                ["full-stack", "Full-stack"],
                ["frontend", "Frontend"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={projectFilter === value}
                  onClick={() => setProjectFilter(value)}
                  className={`min-h-10 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                    projectFilter === value
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-line bg-surface text-muted hover:border-accent-line hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {projectFilter === "all" ? (
              <div className="mt-9 grid grid-cols-1 gap-7 lg:mt-12 lg:gap-9">
                {visibleProjects.map((project, index) => (
                  <ProjectShowcase key={project.slug} project={project} index={index} eager={index === 0} />
                ))}
              </div>
            ) : (
              <>
                <p className="mt-7 text-sm text-muted" role="status">
                  {visibleProjects.length} {projectFilter === "full-stack" ? "full-stack" : "frontend"}{" "}
                  {visibleProjects.length === 1 ? "project" : "projects"} with case studies
                </p>
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {visibleProjects.map((project) => (
                    <div key={project.slug} className="h-full">
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </Container>
      </div>

      <Container className="py-16 sm:py-20 lg:py-28">
        <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24">
          <SectionHeader
            id="skills-title"
            eyebrow="Interactive constellation"
            title="Technical skills matrix"
            lead="Technologies and engineering tools structured across complementary domains."
          />
          <SkillGroups className="mt-8 lg:mt-10" />
        </section>
      </Container>

      <Container className="pb-16 sm:pb-20 lg:pb-28">
        <section
          id="contact"
          aria-labelledby="contact-title"
          data-reveal
          className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:p-14"
        >
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Start a conversation</p>
              <h2 id="contact-title" className="text-title mt-3 text-fg">
                Let&apos;s build something useful.
              </h2>
              <p className="text-lead mt-4 max-w-[38rem] text-muted">
                I&apos;m open to software engineering opportunities and thoughtful collaborations on products that solve real problems.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <CopyButton value={site.contact.email} label="Copy email address" text="Copy email" />
              </div>
              <ul className="mt-7 grid grid-cols-1" aria-label="Contact details and profiles">
                <li>
                  <a href={`mailto:${site.contact.email}`} className={contactLink}>
                    <Mail aria-hidden className="size-5 shrink-0 text-muted" />
                    <span className="min-w-0 break-words">{site.contact.email}</span>
                  </a>
                </li>
                <li>
                  <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={contactLink}>
                    <GitHubIcon className="size-5 shrink-0 text-muted" />
                    GitHub
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={contactLink}>
                    <LinkedInIcon className="size-5 shrink-0 text-muted" />
                    LinkedIn
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li className="flex min-h-12 items-center gap-3 py-3 text-sm font-medium text-fg">
                  <MapPin aria-hidden className="size-5 shrink-0 text-muted" />
                  {site.person.location}
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-bg/40 p-5 sm:p-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

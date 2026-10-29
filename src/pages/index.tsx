import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Hero } from "@/components/home/Hero";
import { SkillGroups } from "@/components/home/SkillGroups";
import { CopyButton } from "@/components/contact/CopyButton";
import { LabCards } from "@/components/lab/LabCards";
import { FlagshipProject, ProjectCard, RealtimeProject } from "@/components/projects/ProjectCard";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeader } from "@/components/ui/Section";
import { getProject, homeAdditionalSlugs } from "@/content/projects";
import { aboutSummary, aboutFacts } from "@/content/profile";
import { site } from "@/config/site";

const routebridge = getProject("routebridge")!;
const voxplay = getProject("voxplay")!;
const additional = homeAdditionalSlugs.map((slug) => getProject(slug)!);

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
  "group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm font-medium text-fg transition-colors hover:border-accent-line hover:bg-surface-2";

export default function OverviewPage() {
  return (
    <>
      <Seo jsonLd={personJsonLd} />
      <Hero />

      <Container className="section-gap grid grid-cols-[minmax(0,1fr)]">
        <section aria-labelledby="work-title" id="work" className="scroll-mt-24">
          <SectionHeader
            id="work-title"
            eyebrow="Featured work"
            title="Two products, built end to end"
            lead="A logistics platform that shows how I model data and design reliable APIs, and a real-time game platform that shows a different side of my work."
          />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-12 lg:gap-10">
            <FlagshipProject project={routebridge} eager />
            <RealtimeProject project={voxplay} />
          </div>
        </section>

        <section aria-labelledby="projects-title" id="projects" className="scroll-mt-24">
          <SectionHeader
            id="projects-title"
            eyebrow="Learning projects"
            title="Additional projects"
            lead="Smaller projects from my training, each focused on one skill."
            action={
              <Link href="/projects" className="link-arrow">
                All projects
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {additional.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="about-title" id="about" className="scroll-mt-24">
          <div data-reveal className="grid grid-cols-[minmax(0,1fr)] gap-8 border-t border-line pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div>
              <p className="eyebrow">About</p>
              <h2 id="about-title" className="text-title mt-3 text-fg">
                Interfaces and backends that hold up in real use
              </h2>
            </div>
            <div>
              <div className="prose-body measure text-lead text-muted">
                {aboutSummary.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <dl className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2">
                {aboutFacts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-meta text-subtle">{f.label}</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="link-arrow mt-8">
                More about me, my toolkit and experience
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="skills-title" id="skills" className="scroll-mt-24">
          <SectionHeader
            id="skills-title"
            eyebrow="Technical skills"
            title="What I build with"
            lead="The technologies behind the projects above, grouped by where they sit in a product."
          />
          <SkillGroups className="mt-8 lg:mt-10" />
        </section>

        <section aria-labelledby="lab-title" id="lab" className="scroll-mt-24">
          <SectionHeader
            id="lab-title"
            eyebrow="Interactive Lab"
            title="Experiments & play"
            lead="A small, separate corner of the site: two short browser games, one built from logic and debugging puzzles and one a mini version of VoxPlay's quiz. No sign-up; nothing is stored on a server."
            action={
              <Link href="/playground" className="link-arrow">
                Everything in the Lab
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            }
          />
          <div className="mt-8 lg:mt-10">
            <LabCards />
          </div>
        </section>

        <section data-reveal aria-labelledby="contact-title" id="contact" className="card scroll-mt-24 rounded-2xl px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title" className="text-title mt-3 text-fg">
                Have a project worth building?
              </h2>
              <p className="text-lead mt-4 max-w-[34rem] text-muted">
                I&apos;m open to software engineering roles and to working with teams, collaborators and clients. Email
                is the quickest way to reach me, or use the{" "}
                <Link href="/contact" className="link underline underline-offset-4">
                  contact form
                </Link>
                .
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href={`mailto:${site.contact.email}`} size="lg">
                  <Mail aria-hidden className="size-4" />
                  Email me
                </ButtonLink>
                <CopyButton value={site.contact.email} label="Copy email address" text="Copy email" />
              </div>
              <p className="text-meta mt-3 text-muted">{site.contact.email}</p>
            </div>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3" aria-label="Other ways to reach me">
              <li>
                <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <GitHubIcon className="size-5 text-muted group-hover:text-fg" />
                  GitHub
                  <span className="ml-auto truncate text-meta font-normal text-muted">{site.links.github.replace(/^https:\/\//, "")}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <LinkedInIcon className="size-5 text-muted group-hover:text-fg" />
                  LinkedIn
                  <span className="ml-auto truncate text-meta font-normal text-muted">in/necherem-chukwu</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href={site.cv.viewHref} className={contactLink}>
                  <FileText aria-hidden className="size-5 text-muted group-hover:text-fg" />
                  CV
                  <span className="ml-auto text-meta font-normal text-muted">Read online or download the PDF</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}

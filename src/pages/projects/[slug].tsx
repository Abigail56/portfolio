import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { FlowDiagram } from "@/components/projects/FlowDiagram";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { StatusText } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Section";
import { categoryLabels, getAdjacentProjects, getProject, projects, statusLabels } from "@/content/projects";
import type { EngineeringNote, Note } from "@/lib/types";

interface Props {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: projects.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const slug = String(params?.slug ?? "");
  return getProject(slug) ? { props: { slug } } : { notFound: true };
};

const slugify = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      id={slugify(title)}
      aria-labelledby={`${slugify(title)}-title`}
      data-reveal
      className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-4 border-t border-line pt-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]"
    >
      <h2 id={`${slugify(title)}-title`} className="text-subtitle text-fg">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="measure grid grid-cols-[minmax(0,1fr)] gap-3 text-[0.9375rem] leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.7rem] h-px w-2.5 shrink-0 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Notes({ notes }: { notes: Note[] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
      {notes.map((n) => (
        <div key={n.title} className="card rounded-xl p-5">
          <dt className="text-card text-fg">{n.title}</dt>
          <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{n.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function Engineering({ notes }: { notes: EngineeringNote[] }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10">
      {notes.map((n) => (
        <div key={n.title}>
          <h3 className="text-card text-fg">{n.title}</h3>
          <p className="measure mt-2 leading-relaxed text-muted">{n.detail}</p>
          {n.points && (
            <div className="mt-4">
              <List items={n.points} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CaseStudyPage({ slug }: Props) {
  const project = getProject(slug);
  if (!project) return null;
  const cs = project.caseStudy;
  const inDev = project.status === "in-development";
  const { previous, next } = getAdjacentProjects(slug);
  const shot = project.screenshot;
  const kind = project.kind === "learning" ? "Learning project" : "Product";
  // Mirrors the Block titles below, in order, for the "On this page" list.
  const sections = [
    project.highlights && "At a glance",
    "The problem",
    "Users and use cases",
    (cs.flows || cs.howItWorks.length > 0) && "How it works",
    inDev ? "Set up so far" : "Features",
    "My contribution",
    cs.architecture && "Architecture",
    cs.engineering && "Under the hood",
    cs.decisions.length > 0 && "Technical decisions",
    "Implementation",
    cs.challenges.length > 0 && "Challenges",
    cs.testing && "Testing and reliability",
    "Current status",
    cs.lessons && "Lessons learnt",
    inDev ? "Next" : "What I'd improve",
    "Stack",
  ].filter((t): t is string => typeof t === "string");

  return (
    <article style={{ "--project-accent": project.accent } as CSSProperties}>
      <Seo title={`${project.name}: case study`} description={project.summary} image={shot?.desktop} />

      <header className="border-b border-line">
        <Container className="pb-12 pt-10 sm:pt-14">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <ArrowLeft aria-hidden className="size-4" />
            All projects
          </Link>
          <p className="eyebrow mt-8">{project.featured ? "Featured case study" : "Case study"}</p>
          <h1 className="text-display mt-3 text-fg">{project.name}</h1>
          <p className="text-lead mt-5 max-w-[42rem] text-muted">{project.summary}</p>
          <ProjectLinks project={project} explain className="mt-6" />

          <dl className="mt-10 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              { label: "Year", value: project.period },
              { label: "Type", value: `${categoryLabels[project.category]} · ${kind}` },
              { label: "Status", value: statusLabels[project.status] },
              { label: "Role", value: "Solo project" },
            ].map((item) => (
              <div key={item.label} className="card rounded-xl px-4 py-3.5">
                <dt className="text-meta text-subtle">{item.label}</dt>
                <dd className="mt-1 font-medium text-fg">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      {shot && (
        <Container className="mt-12">
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="card rounded-2xl p-2 shadow-md sm:p-3">
              <ProjectPreview project={project} eager sizes="(min-width: 1024px) 780px, 100vw" />
            </div>
            {shot.mobile && (
              <figure className="card hidden rounded-2xl p-2 shadow-md lg:block">
                <div className="relative aspect-[390/844] overflow-hidden rounded-xl bg-surface-2" style={shot.backdrop ? { backgroundColor: shot.backdrop } : undefined}>
                  <Image src={shot.mobile} alt={`${project.name} at phone width`} fill sizes="192px" className="object-cover object-top" />
                </div>
              </figure>
            )}
          </div>
          <p className="mt-3 text-xs text-subtle">
            Screenshots captured from {shot.capturedFrom}
            {shot.mobile ? ", at desktop and phone widths" : ""}.
          </p>
        </Container>
      )}

      {sections.length > 4 && (
        <Container className="mt-12">
          <nav aria-label="On this page" className="card rounded-xl px-5 py-4">
            <p className="text-meta font-semibold text-fg">On this page</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              {sections.map((title) => (
                <li key={title}>
                  <a href={`#${slugify(title)}`} className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      )}

      <Container className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-12 lg:mt-16">
        {project.highlights && (
          <Block title="At a glance">
            <dl className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
              {project.highlights.map((h) => (
                <div key={h.title} className="card rounded-xl p-5">
                  <dt className="text-card text-fg">{h.title}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{h.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>
        )}

        <Block title="The problem">
          <p className="measure text-lead text-fg">{cs.problem}</p>
        </Block>

        <Block title="Users and use cases">
          <p className="measure leading-relaxed text-muted">{cs.audience}</p>
        </Block>

        {(cs.flows || cs.howItWorks.length > 0) && (
          <Block title="How it works">
            {cs.flows && (
              <div className="mb-10 grid grid-cols-[minmax(0,1fr)] gap-6">
                {cs.flows.map((flow) => (
                  <div key={flow.title} className="card rounded-xl p-5 sm:p-6">
                    <FlowDiagram flow={flow} />
                  </div>
                ))}
              </div>
            )}
            {cs.howItWorks.length > 0 && (
              <ol className="measure grid grid-cols-[minmax(0,1fr)] gap-4 text-[0.9375rem] leading-relaxed text-muted">
                {cs.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="w-5 shrink-0 font-mono text-sm text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </Block>
        )}

        <Block title={inDev ? "Set up so far" : "Features"}>
          <List items={project.features} />
          {project.planned && (
            <>
              <h3 className="text-card mt-8 text-fg">Planned, not built</h3>
              <div className="mt-3">
                <List items={project.planned} />
              </div>
            </>
          )}
        </Block>

        <Block title="My contribution">
          <List items={project.contributions} />
        </Block>

        {cs.architecture && (
          <Block title="Architecture">
            <ArchitectureDiagram architecture={cs.architecture} />
          </Block>
        )}

        {cs.engineering && (
          <Block title="Under the hood">
            <Engineering notes={cs.engineering} />
          </Block>
        )}

        {cs.decisions.length > 0 && (
          <Block title="Technical decisions">
            <Notes notes={cs.decisions} />
          </Block>
        )}

        <Block title="Implementation">
          <h3 className="text-card text-fg">{inDev ? "What exists so far" : "What I built"}</h3>
          <div className="mt-3">
            <List items={cs.built} />
          </div>
          {cs.snippet && (
            <div className="mt-9">
              <CodeBlock snippet={cs.snippet} />
            </div>
          )}
        </Block>

        {cs.challenges.length > 0 && (
          <Block title="Challenges">
            <Notes notes={cs.challenges} />
          </Block>
        )}

        {cs.testing && (
          <Block title="Testing and reliability">
            <List items={cs.testing} />
          </Block>
        )}

        <Block title="Current status">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-fg">
            <StatusText status={project.status} />
          </p>
          {cs.statusNote && <p className="measure mt-3 leading-relaxed text-muted">{cs.statusNote}</p>}
          {cs.limitations && (
            <>
              <h3 className="text-card mt-8 text-fg">Known limitations</h3>
              <div className="mt-3">
                <List items={cs.limitations} />
              </div>
            </>
          )}
          <ProjectLinks project={project} explain className="mt-6" />
        </Block>

        {cs.lessons && (
          <Block title="Lessons learnt">
            <ol className="measure grid grid-cols-[minmax(0,1fr)] gap-5 text-[0.9375rem] leading-relaxed text-muted">
              {cs.lessons.map((lesson, i) => {
                // Each lesson opens with a one-sentence takeaway, shown as its heading.
                const split = lesson.indexOf(". ");
                const [point, detail] = split === -1 ? [lesson, ""] : [lesson.slice(0, split + 1), lesson.slice(split + 2)];
                return (
                  <li key={lesson} className="flex gap-4">
                    <span className="w-5 shrink-0 font-mono text-sm text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-semibold text-fg">{point}</span>
                      {detail && <span className="mt-1 block">{detail}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Block>
        )}

        <Block title={inDev ? "Next" : "What I'd improve"}>
          <List items={cs.nextSteps} />
        </Block>

        <Block title="Stack">
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </Block>
      </Container>

      <Container className="mt-20">
        <nav aria-label="More projects" className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-line pt-8 sm:grid-cols-2">
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="group">
              <span className="inline-flex items-center gap-1 text-sm text-subtle">
                <ArrowLeft aria-hidden className="size-3.5" /> Previous
              </span>
              <span className="mt-1 block font-medium text-fg group-hover:text-accent">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="group sm:text-right">
              <span className="inline-flex items-center gap-1 text-sm text-subtle">
                Next <ArrowRight aria-hidden className="size-3.5" />
              </span>
              <span className="mt-1 block font-medium text-fg group-hover:text-accent">{next.name}</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}

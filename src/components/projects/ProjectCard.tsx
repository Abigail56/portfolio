import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabels, statusLabels } from "@/content/projects";
import { StatusText } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FlowDiagram } from "./FlowDiagram";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectLinks } from "./ProjectLinks";

function Tags({ items, className, tagClassName }: { items: string[]; className?: string; tagClassName?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Technologies">
      {items.map((tech) => (
        <li key={tech} className={cn("tag", tagClassName)}>
          {tech}
        </li>
      ))}
    </ul>
  );
}

const core = (project: Project) => project.coreStack ?? project.stack.slice(0, 5);

/**
 * The flagship project (RouteBridge): summary and links beside a real screenshot, then its engineering highlights and
 * the delivery lifecycle drawn from the code. Only the title, the screenshot and the links are links; the card itself
 * isn't, so each link stays independently reachable.
 */
export function FlagshipProject({ project, eager }: { project: Project; eager?: boolean }) {
  const href = `/projects/${project.slug}`;
  const flow = project.caseStudy.flows?.[0];
  return (
    <article data-reveal aria-labelledby={`${project.slug}-title`} className="card overflow-hidden rounded-2xl shadow-sm">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <p className="text-meta flex flex-wrap items-center gap-x-2 font-medium text-subtle">
            <span className="text-accent">Flagship case study</span>
            <span aria-hidden>·</span>
            {categoryLabels[project.category]}
            <span aria-hidden>·</span>
            {project.period}
          </p>
          <h3 id={`${project.slug}-title`} className="text-project mt-3 text-fg">
            <Link href={href} className="transition-colors hover:text-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-4 text-base leading-[1.7] text-muted">{project.summary}</p>
          <Tags items={core(project)} className="mt-6" />
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href={href} className="group">
              Read the case study
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sr-only">: {project.name}</span>
            </ButtonLink>
            <ProjectLinks project={project} />
          </div>
          <StatusText status={project.status} className="mt-5" />
        </div>
        <Link href={href} tabIndex={-1} aria-hidden className="order-first block lg:order-none">
          <ProjectPreview project={project} eager={eager} sizes="(min-width: 1280px) 640px, (min-width: 1024px) 55vw, 100vw" />
        </Link>
      </div>

      {project.highlights && (
        <ul aria-label="Engineering highlights" className="grid grid-cols-[minmax(0,1fr)] border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {project.highlights.map((h, i) => (
            <li
              key={h.title}
              className="border-line p-5 max-sm:[&:not(:last-child)]:border-b sm:p-6 sm:max-lg:[&:nth-child(-n+2)]:border-b sm:max-lg:[&:nth-child(odd)]:border-r lg:p-7 lg:[&:not(:last-child)]:border-r"
            >
              <span className="font-mono text-xs text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="text-card mt-2 text-fg">{h.title}</h4>
              <p className="mt-2 text-[0.9375rem] leading-[1.65] text-muted">{h.detail}</p>
            </li>
          ))}
        </ul>
      )}

      {flow && (
        <div className="border-t border-line bg-surface-2 px-5 py-6 sm:px-8 lg:px-10">
          <p className="text-meta mb-3 font-semibold text-fg">{flow.title}</p>
          <FlowDiagram flow={flow} compact />
        </div>
      )}
    </article>
  );
}

/**
 * The second featured project (VoxPlay), on a dark panel so it reads as a different kind of work: real-time and
 * interactive. Lists which games are built and which are planned, and says plainly that it isn't deployed.
 */
export function RealtimeProject({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  const shot = project.screenshot;
  return (
    <article data-reveal aria-labelledby={`${project.slug}-title`} className="panel-ink overflow-hidden rounded-2xl">
      {/* Phones: screenshot, text, games. Desktop: screenshot and games on the left, text on the right. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 p-5 [grid-template-areas:'shot'_'text'_'games'] sm:p-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6 lg:p-10 lg:[grid-template-areas:'shot_text'_'games_text']">
          {shot && (
            <Link href={href} tabIndex={-1} aria-hidden className="block [grid-area:shot]">
              <ProjectPreview project={project} sizes="(min-width: 1280px) 560px, (min-width: 1024px) 48vw, 100vw" className="[&>div]:border-ink-line" />
            </Link>
          )}
          {project.modules && (
            <div className="[grid-area:games]">
              <p className="text-meta font-semibold text-ink-fg">{project.modules.label}</p>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {project.modules.items.map((m) => (
                  <li
                    key={m.name}
                    className={cn(
                      "rounded-lg border px-3 py-2.5",
                      m.planned ? "border-dashed border-ink-line-strong" : "border-ink-line bg-white/[0.04]",
                    )}
                  >
                    <span className="block text-sm font-medium text-ink-fg">{m.name}</span>
                    <span className="text-meta block text-ink-muted">{m.planned ? "Planned, not built" : m.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="[grid-area:text] lg:py-1">
          <p className="text-meta flex flex-wrap items-center gap-x-2 font-medium text-ink-muted">
            <span className="text-ink-accent">Real-time systems</span>
            <span aria-hidden>·</span>
            {categoryLabels[project.category]}
            <span aria-hidden>·</span>
            {project.period}
          </p>
          <h3 id={`${project.slug}-title`} className="text-project mt-3 text-ink-fg">
            <Link href={href} className="transition-colors hover:text-ink-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-4 text-base leading-[1.7] text-ink-muted">{project.summary}</p>

          {project.highlights && (
            <ul aria-label="Engineering highlights" className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-5 border-t border-ink-line pt-6">
              {project.highlights.map((h) => (
                <li key={h.title}>
                  <h4 className="text-card text-ink-fg">{h.title}</h4>
                  <p className="mt-1 text-[0.9375rem] leading-[1.65] text-ink-muted">{h.detail}</p>
                </li>
              ))}
            </ul>
          )}

          <Tags items={core(project)} className="mt-7" tagClassName="tag-ink" />

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={href}
              className="group inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-[#141a33] transition-colors hover:bg-[#e6e9ff] focus-visible:outline-ink-accent"
            >
              Read the case study
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sr-only">: {project.name}</span>
            </Link>
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-sm font-medium text-ink-fg underline decoration-white/30 underline-offset-4 hover:decoration-white focus-visible:outline-ink-accent"
              >
                Source code
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">: {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
          <p className="text-meta mt-5 flex items-start gap-2 text-ink-muted">
            <span aria-hidden className="mt-[0.4rem] size-2 shrink-0 rounded-full border border-ink-muted" />
            <span>
              <span className="font-medium text-ink-fg">{statusLabels[project.status]}.</span> Runs locally with Docker Compose; no live demo.
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}

/** A compact card for a smaller project: name, one line, main technologies, status and its own links. */
export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  return (
    <article data-reveal className="card flex h-full flex-col rounded-xl p-5 transition-colors duration-200 hover:border-line-strong sm:p-6">
      <p className="text-meta text-subtle">
        {categoryLabels[project.category]} · {project.period.replace(/^Started /, "")}
      </p>
      <h3 className="text-card mt-2 text-fg">
        <Link href={href} className="transition-colors hover:text-accent">
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-[1.65] text-muted">{project.tagline}</p>
      <Tags items={core(project).slice(0, 4)} className="mt-5" />
      <div className="mt-auto pt-6">
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <StatusText status={project.status} />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={href} className="link-arrow">
              Case study
              <ArrowRight aria-hidden className="size-4" />
              <span className="sr-only">: {project.name}</span>
            </Link>
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** A compact row for a smaller project: name and tagline, status, year, and its own links. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-3 border-b border-line py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6 lg:grid-cols-[minmax(0,1fr)_11rem_5rem_minmax(0,13rem)]">
      <div className="min-w-0">
        <h3 className="text-card text-fg">
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
            {project.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{project.tagline}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 lg:contents">
        <StatusText status={project.status} />
        <span className="text-meta text-subtle tabular-nums">{project.period.replace(/^Started /, "")}</span>
        <ProjectLinks project={project} className="text-meta lg:justify-self-end" />
      </div>
    </li>
  );
}

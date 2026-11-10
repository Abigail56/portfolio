import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusText } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { Project } from "@/lib/types";
import { ProjectLinks } from "./ProjectLinks";
import { ProjectPreview } from "./ProjectPreview";

function Points({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-meta font-semibold text-fg">{title}</h4>
      <ul className="mt-2 grid grid-cols-[minmax(0,1fr)] gap-2 text-sm leading-relaxed text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden className="mt-[0.65rem] h-px w-2 shrink-0 bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One selected project: a numbered rule, the name and summary beside the screenshot, then the problem, features and
 * contribution in three columns, and the technologies. Every project uses the same arrangement, so the page reads as one system.
 * Only the name, the screenshot and the links are links, so each stays reachable alone.
 */
export function ProjectShowcase({ project, index, eager }: { project: Project; index: number; eager?: boolean }) {
  const href = `/projects/${project.slug}`;
  const stack = project.coreStack ?? project.stack.slice(0, 6);
  return (
    <article data-reveal aria-labelledby={`${project.slug}-title`} className="card card-hover overflow-hidden rounded-[1.5rem]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-7 p-5 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
        <div className="min-w-0 lg:col-span-5">
          <p className="text-meta flex flex-wrap gap-x-3 text-subtle">
            <span className="font-mono text-accent">{String(index + 1).padStart(2, "0")}</span>
            {project.discipline}
          </p>
          <h3 id={`${project.slug}-title`} className="text-subtitle mt-3 text-fg font-bold sm:text-[1.875rem]">
            <Link href={href} className="transition-colors hover:text-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted">{project.summary}</p>
          <StatusText status={project.status} className="mt-5" />
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href={href} variant="secondary" className="group">
              Read the case study
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sr-only">: {project.name}</span>
            </ButtonLink>
            <ProjectLinks project={project} />
          </div>
        </div>
        <Link href={href} tabIndex={-1} aria-hidden className="group block max-lg:order-first lg:col-span-7">
          <ProjectPreview
            project={project}
            eager={eager}
            sizes="(min-width: 1280px) 640px, (min-width: 1024px) 54vw, 100vw"
            className="[&>div]:transition-colors [&>div]:group-hover:border-accent-line"
          />
        </Link>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-line bg-surface-2 p-5 sm:p-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:px-10">
        <div className="md:col-span-2 lg:col-span-1">
          <h4 className="text-meta font-semibold text-fg">The problem</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.caseStudy.problem}</p>
        </div>
        <Points title="Key features" items={project.features.slice(0, 3)} />
        <Points title="My contribution" items={project.contributions.slice(0, 2)} />
      </div>
      <ul className="flex flex-wrap gap-1.5 border-t border-line px-5 py-4 sm:px-8 lg:px-10" aria-label="Technologies">
        {stack.map((tech) => (
          <li key={tech} className="tag">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

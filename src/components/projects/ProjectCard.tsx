import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryLabels } from "@/content/projects";
import { StatusText } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
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

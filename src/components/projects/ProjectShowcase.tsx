import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusText } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";
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
 * One selected project as an editorial spread: a numbered rule, then the screenshot and the facts side by side,
 * alternating sides down the page. Only the name, the screenshot and the links are links, so each stays reachable alone.
 */
export function ProjectShowcase({ project, index, eager }: { project: Project; index: number; eager?: boolean }) {
  const href = `/projects/${project.slug}`;
  const flipped = index % 2 === 1;
  return (
    <article data-reveal aria-labelledby={`${project.slug}-title`} className="border-t border-line-strong pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-meta flex flex-wrap gap-x-3 text-subtle">
          <span className="font-mono text-accent">{String(index + 1).padStart(2, "0")}</span>
          {project.discipline}
        </p>
        <StatusText status={project.status} />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-7 lg:grid-cols-12 lg:gap-12">
        <Link href={href} tabIndex={-1} aria-hidden className={cn("group block lg:col-span-7", flipped && "lg:order-2")}>
          <ProjectPreview
            project={project}
            eager={eager}
            sizes="(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 100vw"
            className="[&>div]:transition-colors [&>div]:group-hover:border-accent-line"
          />
        </Link>
        <div className={cn("min-w-0 lg:col-span-5", flipped && "lg:order-1")}>
          <h3 id={`${project.slug}-title`} className="text-project text-fg">
            <Link href={href} className="transition-colors hover:text-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-3 text-[0.9375rem] leading-[1.7] text-muted">{project.summary}</p>
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5">
            <Points title="Key features" items={project.features.slice(0, 3)} />
            <Points title="My contribution" items={project.contributions.slice(0, 2)} />
          </div>
          <p className="mt-5 font-mono text-xs leading-relaxed text-subtle">{(project.coreStack ?? project.stack.slice(0, 6)).join(" · ")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href={href} variant="secondary" className="group">
              Read the case study
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="sr-only">: {project.name}</span>
            </ButtonLink>
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Live app and source links as plain text. Missing links are explained when `explain` is set. */
export function ProjectLinks({ project, className, explain }: { project: Project; className?: string; explain?: boolean }) {
  const { live, repo } = project.links;
  const notes = [
    !live && explain && (project.status === "not-deployed" ? "No public demo; it runs locally." : "Not released yet."),
    !repo && explain && (project.repoNote ?? "No public repository."),
  ].filter(Boolean);

  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-sm", className)}>
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-0.5 font-medium">
          Live demo
          <ArrowUpRight aria-hidden className="size-3.5" />
          <span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
      )}
      {repo && (
        <a href={repo} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-0.5 font-medium">
          Source code
          <ArrowUpRight aria-hidden className="size-3.5" />
          <span className="sr-only">: {project.name} (opens in a new tab)</span>
        </a>
      )}
      {notes.length > 0 && <span className="text-subtle">{notes.join(" ")}</span>}
    </div>
  );
}

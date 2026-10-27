import { cn } from "@/lib/cn";
import type { ProjectStatus } from "@/lib/types";
import { statusLabels } from "@/content/projects";

const statusDot: Record<ProjectStatus, string> = {
  live: "bg-success",
  "not-deployed": "bg-subtle",
  "in-development": "bg-warning",
};

/** Project status as plain text with a small dot. */
export function StatusText({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-meta font-medium text-muted", className)}>
      <span aria-hidden className={cn("size-2 rounded-full", statusDot[status])} />
      {statusLabels[status]}
    </span>
  );
}

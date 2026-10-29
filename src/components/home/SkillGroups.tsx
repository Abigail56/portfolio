import { skillGroups } from "@/content/profile";
import { cn } from "@/lib/cn";

/**
 * The toolkit as one row per category: the category and what it covers on the left, the technologies on the right.
 * Plain text rather than badges, and no levels or percentages; the projects show how each one is used.
 */
export function SkillGroups({ className }: { className?: string }) {
  return (
    <dl className={cn("card divide-y divide-line rounded-2xl", className)}>
      {skillGroups.map((group) => (
        <div
          key={group.id}
          data-reveal
          className="grid grid-cols-[minmax(0,1fr)] gap-3 p-5 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:px-8"
        >
          <dt>
            <span className="text-card block text-fg">{group.label}</span>
            <span className="text-meta mt-1 block max-w-[30rem] text-muted">{group.summary}</span>
          </dt>
          <dd>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-fg lg:pt-0.5" aria-label={group.label}>
              {group.skills.map((skill) => (
                <li key={skill.name} className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-1 rounded-full bg-accent-line" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}

import { skillGroups } from "@/content/profile";
import { cn } from "@/lib/cn";

/** The toolkit in four columns separated by fine rules. Badges only: no levels or percentages. */
export function SkillGroups({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] border-t border-line sm:grid-cols-2 lg:grid-cols-4", className)}>
      {skillGroups.map((group) => (
        <section key={group.id} aria-labelledby={`skills-${group.id}`} data-reveal className="border-b border-line py-6 sm:pr-8 lg:border-b-0 lg:pt-7">
          <h3 id={`skills-${group.id}`} className="text-card text-fg">
            {group.label}
          </h3>
          <p className="text-meta mt-1 text-subtle">{group.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {group.skills.map((skill) => (
              <li key={skill.name} className="tag">
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

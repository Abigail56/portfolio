import { languages, timeline } from "@/content/profile";
import type { TimelineKind } from "@/lib/types";

const groups: { kind: TimelineKind; label: string }[] = [
  { kind: "training", label: "Software engineering training" },
  { kind: "employment", label: "Professional experience" },
  { kind: "leadership", label: "Leadership" },
  { kind: "education", label: "Education" },
];

/** An editorial timeline taken from the CV: group labels on the left, entries on the right. */
export function Experience() {
  return (
    <div className="border-t border-line">
      {groups.map(({ kind, label }) => (
        <section key={kind} aria-label={label} data-reveal className="grid grid-cols-[minmax(0,1fr)] gap-4 border-b border-line py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
          <h3 className="text-meta font-semibold uppercase tracking-[0.08em] text-subtle md:pt-1">{label}</h3>
          <ol className="grid grid-cols-[minmax(0,1fr)] gap-7">
            {timeline
              .filter((entry) => entry.kind === kind)
              .map((entry) => (
                <li key={entry.title} className="grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <h4 className="text-card text-fg">{entry.title}</h4>
                    <p className="mt-0.5 text-sm text-muted">
                      {entry.organisation}
                      {entry.location && `, ${entry.location}`}
                    </p>
                  </div>
                  <p className="text-meta font-mono text-subtle sm:row-start-1 sm:col-start-2 sm:pt-0.5">{entry.period}</p>
                  {entry.points.length > 0 && (
                    <ul className="mt-2 grid max-w-[46rem] grid-cols-[minmax(0,1fr)] gap-1.5 text-sm leading-relaxed text-muted sm:col-span-2">
                      {entry.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ol>
        </section>
      ))}
      <section aria-label="Languages" className="grid grid-cols-[minmax(0,1fr)] gap-4 border-b border-line py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
        <h3 className="text-meta font-semibold uppercase tracking-[0.08em] text-subtle md:pt-0.5">Languages</h3>
        <p className="text-sm text-muted">{languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}</p>
      </section>
    </div>
  );
}

"use client";

import { Code2, Database, Server, Wrench } from "lucide-react";
import { useState } from "react";
import { skillGroups } from "@/content/profile";
import { cn } from "@/lib/cn";

const groupIcons = {
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Wrench,
};

function skillMark(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();
}

/** The toolkit in four columns separated by fine rules. Badges only: no levels or percentages. */
export function SkillGroups({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState(skillGroups[0]?.id ?? "");
  const active = skillGroups.find((group) => group.id === activeId) ?? skillGroups[0];

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)]", className)}>
      <div data-reveal className="relative aspect-square min-h-[20rem] overflow-hidden rounded-2xl border border-line bg-surface/35">
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" />
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-line" />
        <div aria-hidden className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft blur-xl" />
        {skillGroups.map((group, index) => {
          const Icon = groupIcons[group.id as keyof typeof groupIcons] ?? Code2;
          const activeGroup = activeId === group.id;
          const positions = [
            "left-[18%] top-[18%]",
            "right-[12%] top-[27%]",
            "bottom-[17%] right-[23%]",
            "bottom-[20%] left-[14%]",
          ];
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={activeGroup}
              onClick={() => setActiveId(group.id)}
              className={`absolute ${positions[index]} group grid size-20 place-items-center rounded-full border text-center transition-[transform,border-color,background-color,box-shadow] duration-300 sm:size-24 ${
                activeGroup
                  ? "scale-105 border-accent bg-accent-soft text-accent shadow-[0_0_35px_var(--glow)]"
                  : "border-line bg-surface text-muted hover:-translate-y-1 hover:border-accent-line hover:text-fg"
              }`}
            >
              <span className="grid justify-items-center gap-1">
                <Icon aria-hidden className="size-5" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.06em]">{group.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      {active && (
        <section data-reveal aria-live="polite" className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent">Interactive constellation</p>
          <h3 className="mt-4 text-subtitle text-fg">{active.label}</h3>
          <p className="mt-2 text-sm text-muted">{active.summary}</p>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {active.skills.map((skill) => (
              <li key={skill.name} className="flex min-h-12 items-center gap-3 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fg transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent-line">
                <span aria-hidden className="grid size-7 place-items-center rounded-md border border-accent-line bg-accent-soft font-mono text-[0.58rem] font-semibold text-accent">
                  {skillMark(skill.name)}
                </span>
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

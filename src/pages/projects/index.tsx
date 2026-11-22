"use client";

import { useState } from "react";
import { Seo } from "@/components/layout/Seo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { Container, PageHeader, SectionHeader } from "@/components/ui/Section";
import { earlierProjects, projects, selectedProjects } from "@/content/projects";
import type { ProjectCategory } from "@/lib/types";

export default function WorkPage() {
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const filteredProjects = category === "all" ? projects : projects.filter((project) => project.category === category);

  return (
    <>
      <Seo title="Projects" description="Software projects by Chukwu Chinecherem, each with a case study, real screenshots and an honest status." />
      <PageHeader
        eyebrow="Projects"
        title="Selected work"
        lead="Five full-stack products, followed by smaller projects from my training. Every project has a case study, and each status says what is deployed and what isn't."
      />
      <Container className="section-gap mt-14 grid grid-cols-[minmax(0,1fr)] lg:mt-16">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {([
            ["all", "All projects"],
            ["full-stack", "Full-stack"],
            ["frontend", "Frontend"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={`min-h-10 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                category === value
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:border-accent-line hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {category !== "all" ? (
          <section aria-label={`${category === "full-stack" ? "Full-stack" : "Frontend"} projects`}>
            <p className="text-sm text-muted" role="status">
              {filteredProjects.length} {category === "full-stack" ? "full-stack" : "frontend"}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"} with case studies
            </p>
            <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <li key={project.slug} className="h-full">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
        <>
        <section aria-label="Selected work">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:gap-10">
            {selectedProjects.map((project, i) => (
              <ProjectShowcase key={project.slug} project={project} index={i} eager={i === 0} />
            ))}
          </div>
        </section>
        <section aria-labelledby="additional-title">
          <SectionHeader
            id="additional-title"
            eyebrow="Learning projects"
            title="Earlier training projects"
            lead="Smaller work, each focused on one skill. Some aren't deployed or have private repositories; each case study says so."
          />
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:mt-10">
            {earlierProjects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
        </>
        )}
      </Container>
    </>
  );
}

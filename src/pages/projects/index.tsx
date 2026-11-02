import { Seo } from "@/components/layout/Seo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { Container, PageHeader, SectionHeader } from "@/components/ui/Section";
import { earlierProjects, selectedProjects } from "@/content/projects";

export default function WorkPage() {
  return (
    <>
      <Seo title="Projects" description="Software projects by Chukwu Chinecherem, each with a case study, real screenshots and an honest status." />
      <PageHeader
        eyebrow="Projects"
        title="Selected work"
        lead="Five full-stack products, followed by smaller projects from my training. Every project has a case study, and each status says what is deployed and what isn't."
      />
      <Container className="section-gap mt-14 grid grid-cols-[minmax(0,1fr)] lg:mt-16">
        <section aria-label="Selected work">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:gap-20">
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
      </Container>
    </>
  );
}

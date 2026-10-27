import { Seo } from "@/components/layout/Seo";
import { FlagshipProject, ProjectCard, RealtimeProject } from "@/components/projects/ProjectCard";
import { Container, PageHeader, SectionHeader } from "@/components/ui/Section";
import { getProject, projects } from "@/content/projects";

const routebridge = getProject("routebridge")!;
const voxplay = getProject("voxplay")!;
const others = projects.filter((p) => !p.featured);

export default function WorkPage() {
  return (
    <>
      <Seo title="Projects" description="Software projects by Chukwu Chinecherem, each with a case study, real screenshots and an honest status." />
      <PageHeader
        eyebrow="Projects"
        title="Everything I've built"
        lead="Two products I designed and built end to end, then smaller projects from my training. Every project has a case study, and each status says what is deployed and what isn't."
      />
      <Container className="section-gap mt-14 grid grid-cols-[minmax(0,1fr)] lg:mt-16">
        <section aria-labelledby="featured-title">
          <SectionHeader id="featured-title" eyebrow="Featured" title="Products built end to end" />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:gap-10">
            <FlagshipProject project={routebridge} eager />
            <RealtimeProject project={voxplay} />
          </div>
        </section>
        <section aria-labelledby="additional-title">
          <SectionHeader
            id="additional-title"
            eyebrow="Learning projects"
            title="Additional projects"
            lead="Smaller and earlier work. Some aren't deployed or have private repositories; each case study says so."
          />
          <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {others.map((project) => (
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

import Link from "next/link";
import { ArrowRight, Blocks, BriefcaseBusiness, Database, Gauge, Layers3, Rocket, ShieldCheck, Workflow } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Container, PageHeader } from "@/components/ui/Section";
import { site } from "@/config/site";

const services = [
  {
    title: "Full-Stack Web Development",
    description: "Building complete web applications from responsive interfaces to backend services, data models, and deployment-ready architecture.",
    icon: Blocks,
  },
  {
    title: "Backend and API Development",
    description: "Developing secure RESTful APIs, modular backend systems, authentication flows, and production-ready service layers.",
    icon: ShieldCheck,
  },
  {
    title: "Frontend Development",
    description: "Creating clear, accessible, and responsive interfaces with strong UX decisions and interaction design.",
    icon: Rocket,
  },
  {
    title: "Database Design and Integration",
    description: "Designing relational databases, migrations, persistence patterns, and integrations that are maintainable at scale.",
    icon: Database,
  },
  {
    title: "Business Process Automation",
    description: "Automating operational workflows, internal tools, and repetitive business processes to improve clarity and throughput.",
    icon: Workflow,
  },
  {
    title: "Real-Time Applications",
    description: "Building event-driven experiences with WebSockets, SSE and live status updates for collaborative and operational systems.",
    icon: Gauge,
  },
  {
    title: "E-Commerce and Logistics Solutions",
    description: "Designing shopping, order management, fulfilment, and delivery workflows that fit real operational demands.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Built Environment Technology",
    description: "Exploring software systems for construction, facilities operations, project coordination and intelligent building workflows.",
    icon: Layers3,
  },
];

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description={`Professional services by ${site.person.name}, including full-stack web development, backend engineering, automation, and logistics technology solutions.`}
      />

      <PageHeader
        eyebrow="What I can build for you"
        title="Purpose-built software for real operational needs"
        lead="I work across product design, frontend engineering, backend systems, and deployment strategy to turn clear requirements into dependable software."
      />

      <Container className="pb-16 pt-12 sm:pb-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, description, icon: Icon }) => (
            <article key={title} className="card rounded-2xl p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon aria-hidden className="size-5" />
              </span>
              <h2 className="mt-5 text-card text-fg">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
          <p className="eyebrow">Project conversation</p>
          <h3 className="mt-3 text-title text-fg">Let&apos;s discuss your project</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lead text-muted">
            Whether you need a web product, a backend service, a workflow tool or a technical partner for a product idea, I&apos;d be glad to hear about it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-accent-solid px-4 py-2.5 text-sm font-medium text-on-accent hover:bg-accent-solid-hover">
              Start a conversation
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-2">
              Email me
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}

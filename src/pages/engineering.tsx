import Link from "next/link";
import { Seo } from "@/components/layout/Seo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container, PageHeader } from "@/components/ui/Section";
import { engineeringTopics, type Relation } from "@/content/engineering";
import { getProject } from "@/content/projects";

/** Each relationship on its own line: "Order 1 — 1 DeliveryJob", with the reason underneath. */
function RelationsList({ relations }: { relations: Relation[] }) {
  return (
    <figure className="rounded-lg border border-line">
      <figcaption className="border-b border-line px-4 py-2.5 text-sm text-muted">
        RouteBridge: core relationships <span className="text-subtle">(models/*.py)</span>
      </figcaption>
      <ul className="divide-y divide-line">
        {relations.map((r) => (
          <li key={`${r.from}-${r.to}`} className="px-4 py-3">
            <p className="flex flex-wrap items-baseline gap-x-2 font-mono text-[0.8125rem] text-fg">
              {r.from}
              <span className="text-xs text-subtle">
                {r.cardinality}
                <span className="sr-only"> relationship to</span>
              </span>
              {r.to}
            </p>
            <p className="mt-1 text-sm text-muted">{r.note}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 text-xs text-subtle">
        Every table above except Tenant itself also carries an indexed tenant_id, left out here for readability.
      </p>
    </figure>
  );
}

export default function EngineeringPage() {
  return (
    <>
      <Seo
        title="Engineering"
        description="How Chukwu Chinecherem approaches frontend architecture, API design, data modelling, authentication, error handling, testing and deployment, with examples from real projects."
      />
      <PageHeader
        eyebrow="How I build"
        title="Engineering"
        lead="How I approach the parts of a system that have to be right. Every example comes from my own repositories, and the code is quoted from the files named above it."
      >
        <nav aria-label="Topics">
          <ul className="flex flex-wrap gap-2 text-sm">
            {engineeringTopics.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="inline-flex rounded-lg glass-card px-3 py-1.5 text-muted shadow-sm transition-colors hover:border-accent-line hover:text-fg">
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-16">
        {engineeringTopics.map((topic) => (
          <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-title`} data-reveal className="scroll-mt-24 border-t border-line pt-10">
            <div
              className={
                topic.snippet || topic.relations
                  ? "grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12"
                  : "max-w-2xl"
              }
            >
              <div>
                <h2 id={`${topic.id}-title`} className="text-xl font-semibold text-fg sm:text-2xl">
                  {topic.title}
                </h2>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg">{topic.lead}</p>
                <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3">
                  {topic.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted">
                      <span aria-hidden className="mt-[0.7rem] h-px w-2.5 shrink-0 bg-line-strong" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-subtle">
                  From{" "}
                  {topic.projects.map((slug, idx) => {
                    const project = getProject(slug);
                    if (!project) return null;
                    return (
                      <span key={slug}>
                        {idx > 0 && ", "}
                        <Link href={`/projects/${slug}`} className="link">
                          {project.name}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              </div>
              {(topic.snippet || topic.relations) && (
                <div className="min-w-0">
                  {topic.snippet && <CodeBlock snippet={topic.snippet} />}
                  {topic.relations && <RelationsList relations={topic.relations} />}
                </div>
              )}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}

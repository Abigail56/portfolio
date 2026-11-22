import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { useRouter } from "next/router";
import { Seo } from "@/components/layout/Seo";
import { Container } from "@/components/ui/Section";

const posts: Record<string, { title: string; summary: string; category: string; date: string; readingTime: string; content: string[] }> = {
  "multi-tenant-logistics-platform-fastapi": {
    title: "How I Built a Multi-Tenant Logistics Platform with FastAPI",
    summary: "A practical breakdown of the architecture, access model, and system behaviour behind a multi-tenant logistics product.",
    category: "Architecture",
    date: "2025-05-12",
    readingTime: "7 min read",
    content: [
      "Multi-tenant systems are rarely just about separating records. The real challenge is designing a clear boundary for roles, responsibilities and operational rules so one company cannot accidentally touch another company’s data.",
      "In RouteBridge, the core design decision was to model the business as distinct workspaces with explicit roles: merchants, dispatchers, drivers and finance staff. That allowed the API layer to enforce permissions consistently and made it easier to reason about workflows and failure cases.",
      "FastAPI helped keep the contract explicit. Pydantic models describe valid inputs, SQLModel keeps the data model close to the database, and the route layer attaches permission checks and domain rules before data changes happen.",
      "What makes the system practical is not only the architecture, but the discipline around state transitions. Delivery jobs move through a defined lifecycle, and every change is validated instead of silently allowing invalid movement between states.",
    ],
  },
  "role-based-access-control": {
    title: "Understanding Role-Based Access Control",
    summary: "How role design helps protect business flows and keep application boundaries understandable.",
    category: "Security",
    date: "2025-04-05",
    readingTime: "6 min read",
    content: [
      "Role-Based Access Control is a discipline for making authorization predictable. It prevents the system from giving every user the same privilege and makes the business rules visible in the code.",
      "The first design question should not be 'Which button should this user see?' but 'Which data and actions belong to this role under the system's rules?' Once that is clear, the interface and API can be aligned to the same policy.",
      "In practice, the most important part is keeping the permission model narrow and explicit. If a role cannot do something, the API should fail clearly rather than quietly removing options from the UI.",
    ],
  },
  "websockets-vs-sse": {
    title: "WebSockets vs Server-Sent Events",
    summary: "Comparing real-time communication patterns for live operations, monitoring dashboards and product updates.",
    category: "Realtime",
    date: "2025-03-18",
    readingTime: "5 min read",
    content: [
      "WebSockets and Server-Sent Events solve different classes of problems. WebSockets support bidirectional communication, while SSE is a simpler one-way stream from server to client.",
      "For monitoring and delivery dashboards, SSE is often enough when the client only needs updates pushed from the server. For collaborative edits, chat, or any scenario where clients send events back to the server, WebSockets become more natural.",
      "The right choice depends on the shape of the problem: whether the system is mostly publishing updates, or whether the conversation must travel both ways in real time.",
    ],
  },
};

export default function BlogPostPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const post = posts[slug];

  if (!post) {
    return (
      <Container className="py-16">
        <p className="text-lead text-muted">This article is not available yet.</p>
        <Link href="/blog" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
          <ArrowLeft aria-hidden className="size-4" /> Back to blog
        </Link>
      </Container>
    );
  }

  return (
    <>
      <Seo title={post.title} description={post.summary} />
      <Container className="py-16 sm:py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg">
          <ArrowLeft aria-hidden className="size-4" /> Back to blog
        </Link>

        <article className="mx-auto mt-8 max-w-3xl">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-3 text-display text-fg">{post.title}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted">
            <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden className="size-4" /> {post.date}</span>
            <span className="inline-flex items-center gap-2"><Clock3 aria-hidden className="size-4" /> {post.readingTime}</span>
          </div>

          <div className="prose-body mt-8 text-lead text-muted">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </Container>
    </>
  );
}

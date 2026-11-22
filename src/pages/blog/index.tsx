import Link from "next/link";
import { CalendarDays, Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Seo } from "@/components/layout/Seo";
import { Container, PageHeader } from "@/components/ui/Section";

const posts = [
  {
    slug: "multi-tenant-logistics-platform-fastapi",
    title: "How I Built a Multi-Tenant Logistics Platform with FastAPI",
    excerpt: "A practical look at state management, role-based access, and the trade-offs behind a logistics platform built for delivery operations.",
    category: "Architecture",
    readingTime: "7 min read",
    date: "2025-05-12",
    tags: ["FastAPI", "Multi-tenant", "SQLModel", "PostgreSQL", "Logistics", "RBAC"],
  },
  {
    slug: "role-based-access-control",
    title: "Understanding Role-Based Access Control",
    excerpt: "Why access boundaries matter, how RBAC is modelled in APIs, and the principles behind secure authorization design.",
    category: "Security",
    readingTime: "6 min read",
    date: "2025-04-05",
    tags: ["RBAC", "Authorization", "JWT", "API Security", "Permissions", "Roles"],
  },
  {
    slug: "websockets-vs-sse",
    title: "WebSockets vs Server-Sent Events",
    excerpt: "When to choose bidirectional streaming versus one-way event delivery for operational dashboards and live updates.",
    category: "Realtime",
    readingTime: "5 min read",
    date: "2025-03-18",
    tags: ["WebSockets", "Server-Sent Events", "SSE", "Redis", "Dashboards", "Live Updates"],
  },
];

export default function BlogIndexPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesCategory = category === "All" || post.category === category;
        const searchableText = [post.title, post.excerpt, post.category, ...post.tags].join(" ").toLowerCase();
        return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
      }),
    [category, normalizedQuery],
  );

  return (
    <>
      <Seo title="Blog" description="Engineering notes, architecture ideas and practical lessons from building software for logistics, operations, and digital products." />
      <PageHeader
        eyebrow="Engineering notes"
        title="Ideas, observations and lessons from building software"
        lead="A collection of technical notes on system design, API development, security, and practical software engineering work."
      />

      <Container className="pb-16 pt-12 sm:pb-20">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <Search aria-hidden className="size-4 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search blog posts"
            placeholder="Search topics, ideas or categories"
            className="w-full bg-transparent text-sm text-fg placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter posts by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                category === item
                  ? "border-accent-solid bg-accent-solid text-on-accent"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-muted" role="status">
          {visiblePosts.length} {visiblePosts.length === 1 ? "article" : "articles"} found
        </p>

        {visiblePosts.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-card text-fg">No matching ideas found</p>
            <p className="mt-2 text-sm text-muted">Try architecture, security, RBAC, FastAPI, WebSockets or real-time.</p>
          </div>
        ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <article key={post.slug} className="card rounded-2xl p-6 shadow-sm">
              <p className="text-meta font-medium uppercase tracking-[0.12em] text-accent">{post.category}</p>
              <h2 className="mt-3 text-card text-fg">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
                {post.tags.slice(0, 4).map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.7rem] text-subtle transition-colors hover:border-accent-line hover:text-accent"
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-4 text-xs text-subtle">
                <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden className="size-3.5" /> {post.date}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden className="size-3.5" /> {post.readingTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent">
                Read article
              </Link>
            </article>
          ))}
        </div>
        )}
      </Container>
    </>
  );
}

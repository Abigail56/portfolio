import Link from "next/link";
import { Seo } from "@/components/layout/Seo";
import { Container } from "@/components/ui/Section";
import { projects } from "@/content/projects";

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <Container className="pb-8 pt-20 sm:pt-28">
        <p className="text-sm text-subtle">Error 404</p>
        <h1 className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">The link may be out of date or mistyped.</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/" className="link font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/projects" className="link font-medium">
              Work
            </Link>
          </li>
          <li>
            <Link href="/contact" className="link font-medium">
              Contact
            </Link>
          </li>
        </ul>
        <h2 className="mt-16 border-b border-line pb-3 text-sm font-medium text-subtle">Case studies</h2>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="text-muted underline-offset-4 hover:text-fg hover:underline">
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

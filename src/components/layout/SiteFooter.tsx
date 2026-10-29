import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { footerExtras, navItems, site } from "@/config/site";
import { Container } from "@/components/ui/Section";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const iconLink =
  "grid size-10 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-fg";

/** Identity and profiles on the left, navigation and CV links on the right. */
export function SiteFooter() {
  const initials = site.person.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <footer className="mt-24 border-t border-line bg-surface/40 text-muted lg:mt-32">
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-fg">
            <span aria-hidden className="grid size-9 place-items-center rounded-lg border border-line-strong bg-surface-2 text-[0.8125rem] font-semibold text-fg">
              {initials}
            </span>
            {site.person.name}
          </Link>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed">
            {site.person.role} in {site.person.location}, building complete web products from the database to the
            interface.
          </p>
          <ul className="mt-6 flex gap-2" aria-label="Profiles">
            <li>
              <a href={`mailto:${site.contact.email}`} className={iconLink} aria-label="Email">
                <Mail aria-hidden className="size-[18px]" />
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon className="size-[18px]" />
              </a>
            </li>
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub (opens in a new tab)">
                <GitHubIcon className="size-[18px]" />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-medium text-fg">Explore</h2>
          <ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 text-[0.9375rem]">
            {[...navItems, ...footerExtras].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-medium text-fg">CV</h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed">Read it in your browser, or download the PDF.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={site.cv.viewHref} className="inline-flex h-10 items-center rounded-lg border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
              View CV
            </Link>
            <a
              href={site.cv.href}
              download={site.cv.fileName}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-solid-hover"
            >
              <Download aria-hidden className="size-4" />
              Download CV
            </a>
          </div>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="py-6 text-[0.8125rem] text-subtle">
          <p>
            © {new Date().getFullYear()} {site.person.name}
          </p>
        </Container>
      </div>
    </footer>
  );
}

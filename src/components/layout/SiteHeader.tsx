import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { navItems, site } from "@/config/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const { pathname, events } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu when navigation starts, and on Escape (returning focus to the toggle).
  useEffect(() => {
    const close = () => setMenuOpen(false);
    events.on("routeChangeStart", close);
    return () => events.off("routeChangeStart", close);
  }, [events]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <Container className="flex h-16 items-center gap-8">
        <BrandMark />

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {[...navItems, { label: "CV", href: site.cv.viewHref }].map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative text-sm font-medium tracking-[0.005em] transition-colors",
                      active
                        ? "text-fg after:absolute after:inset-x-0 after:-bottom-[1.5625rem] after:h-px after:bg-accent"
                        : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
          <ThemeToggle />
          <ButtonLink href={site.cv.href} download={site.cv.fileName} size="sm" className="max-sm:hidden">
            <Download aria-hidden className="size-4" />
            Download CV
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-fg transition-colors hover:bg-surface-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </Container>

      <div id={menuId} hidden={!menuOpen} className="border-t border-line bg-bg lg:hidden">
        <Container className="py-4">
          <nav aria-label="Main (mobile)">
            <ul className="divide-y divide-line">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("block py-3.5 text-base font-medium", active ? "text-fg" : "text-muted hover:text-fg")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href={site.cv.viewHref} className="block py-3.5 text-base font-medium text-muted hover:text-fg">
                  View CV
                </Link>
              </li>
            </ul>
          </nav>
          <ButtonLink href={site.cv.href} download={site.cv.fileName} size="lg" className="mt-3 w-full">
            <Download aria-hidden className="size-4" />
            Download CV (PDF)
          </ButtonLink>
          <AvailabilityBadge className="mb-1 mt-4" />
        </Container>
      </div>
    </header>
  );
}

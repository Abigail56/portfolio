import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/config/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = navItems.map((item) => item.href.split("#")[1] ?? "");

export function SiteHeader() {
  const { pathname, events } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    events.on("routeChangeStart", close);
    return () => events.off("routeChangeStart", close);
  }, [events]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target instanceof HTMLElement) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/75">
      <Container className="flex min-h-16 items-center justify-center py-3">
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface/90 p-1.5 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <BrandMark />
          <nav aria-label="Main" className="ml-1 hidden items-center gap-0.5 xl:flex">
            {navItems.map((item) => {
              const sectionId = item.href.split("#")[1] ?? "";
              const active = pathname === "/" && activeSection === sectionId;
              const href = pathname === "/" ? `#${sectionId}` : item.href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  aria-current={active ? "location" : undefined}
                  onClick={() => setActiveSection(sectionId)}
                  className={cn(
                    "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
                    active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-1 flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <ButtonLink href="/contact" size="sm" className="min-h-11 px-4">
              Let&apos;s Talk
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-colors hover:bg-surface-2"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </Container>

      <div id={menuId} hidden={!menuOpen} className="border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden">
        <Container className="py-3">
          <nav aria-label="Main (mobile)">
            <ul className="grid grid-cols-2 gap-1">
              {navItems.map((item) => {
                const sectionId = item.href.split("#")[1] ?? "";
                const active = pathname === "/" && activeSection === sectionId;
                const href = pathname === "/" ? `#${sectionId}` : item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      aria-current={active ? "location" : undefined}
                      onClick={() => {
                        setActiveSection(sectionId);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                        active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}

import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Portrait } from "@/components/ui/Portrait";
import { Container } from "@/components/ui/Section";

const profileLink = "inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-muted transition-colors hover:text-fg";

export function Hero() {
  const capabilities = ["Frontend systems", "API design", "Product UX", "Data + tooling"];
  const stats = [
    { value: "5+", label: "product builds" },
    { value: "3", label: "core stacks" },
    { value: "100%", label: "hands-on" },
  ];

  return (
    <section aria-labelledby="hero-title" className="border-b border-line pb-2">
      <Container className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="max-lg:order-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-subtle">
            <span className="size-2 rounded-full bg-accent" aria-hidden />
            Available for product roles
          </p>

          <h1 id="hero-title" className="mt-6 text-hero text-fg">
            <span className="font-semibold text-subtle">Hi, I&apos;m </span>
            <span className="mt-2 block text-balance">{site.person.name}.</span>
            <span className="mt-2 block bg-gradient-to-r from-fg via-accent to-brand-3 bg-clip-text text-transparent">
              I build digital products
            </span>
            <span className="mt-2 block">that feel as sharp as they perform.</span>
          </h1>

          <p className="text-subtitle mt-5 text-accent">{site.person.role}</p>
          <p className="text-lead mt-6 max-w-[38rem] text-muted">
            I design and develop modern web platforms, backend systems and product experiences that balance speed, clarity and long-term maintainability.
            From UX decisions to API architecture, I help teams turn messy ideas into polished software that works in the real world.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Core capabilities">
            {capabilities.map((item) => (
              <span key={item} className="rounded-full border border-line bg-surface-2 px-2.5 py-1.5 text-[0.75rem] font-medium text-subtle">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
            <ButtonLink href="#work" size="lg" className="group">
              View My Projects
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={site.cv.href} download={site.cv.fileName} variant="secondary" size="lg">
              <Download aria-hidden className="size-4" />
              Download CV
              <span className="sr-only">({site.cv.sizeLabel})</span>
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="lg">
              <Mail aria-hidden className="size-4" />
              Contact Me
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="soft-panel rounded-2xl px-4 py-3">
                <p className="text-[1.35rem] font-semibold tracking-[-0.04em] text-fg">{stat.value}</p>
                <p className="mt-1 text-[0.75rem] uppercase tracking-[0.12em] text-subtle">{stat.label}</p>
              </div>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-0" aria-label="Profiles">
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={profileLink}>
                <GitHubIcon className="size-4" />
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={profileLink}>
                <LinkedInIcon className="size-4" />
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <figure className="relative w-full max-lg:order-1 max-lg:mx-auto max-lg:max-w-[16rem] lg:ml-auto lg:max-w-[22rem]">
          <div className="soft-panel relative overflow-hidden rounded-[2rem] border border-line bg-surface-2/80 p-3 shadow-[0_24px_72px_-32px_rgba(0,0,0,0.75)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,157,255,0.36),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(79,162,246,0.24),transparent_30%)]" aria-hidden />
            <Portrait eager sizes="(min-width: 1024px) 352px, 240px" />
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-line pt-4">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-subtle">Location</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-fg">
                  <MapPin aria-hidden className="size-3.5 text-subtle" />
                  {site.person.location}
                </p>
              </div>
              <div className="rounded-full border border-accent-line bg-accent-soft px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-accent">
                WAT
              </div>
            </div>
          </div>
        </figure>
      </Container>
    </section>
  );
}

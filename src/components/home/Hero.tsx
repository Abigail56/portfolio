import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Portrait } from "@/components/ui/Portrait";
import { Container } from "@/components/ui/Section";

const profileLink = "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted transition-colors hover:text-fg";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-14 pt-10 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <div className="flex items-center gap-3.5">
            {site.photo.src && (
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line bg-surface-2 lg:hidden">
                <Image src={site.photo.src} alt="" fill sizes="56px" className="object-cover" />
              </span>
            )}
            <p className="flex flex-col gap-0.5 text-[0.9375rem] font-semibold tracking-[-0.005em] text-fg sm:block">
              {site.person.name}
              <span className="mx-2 font-normal text-line-strong max-sm:hidden" aria-hidden>
                /
              </span>
              <span className="font-medium text-accent">{site.person.role}</span>
            </p>
          </div>

          <h1 id="hero-title" className="text-display mt-6 max-w-[13.5em] text-fg">
            Building thoughtful digital products, from frontend to backend.
          </h1>
          <p className="text-lead mt-6 max-w-[36rem] text-muted">
            I&apos;m a Full-Stack Software Engineer focused on usable web applications, reliable backend systems and
            maintainable software. I work across frontend interfaces, APIs, databases and real-time features to turn
            ideas into practical products.
          </p>

          <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
            <ButtonLink href="#work" size="lg" className="group">
              Explore My Work
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary" size="lg">
              Get in Touch
            </ButtonLink>
            <Link href={site.cv.viewHref} className="link-arrow h-11 justify-center px-2 text-muted min-[420px]:justify-start">
              <FileText aria-hidden className="size-4" />
              View CV
            </Link>
          </div>

          <ul className="mt-8 flex sm:mt-10  flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6" aria-label="Profiles and availability">
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
            {site.openToOpportunities && (
              <li className="inline-flex items-center gap-2 text-sm text-muted">
                <span aria-hidden className="size-2 rounded-full bg-success ring-4 ring-success-soft" />
                Open to opportunities
              </li>
            )}
            <li className="inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin aria-hidden className="size-4 text-subtle" />
              {site.person.location}
            </li>
          </ul>
        </div>

        <div className="hidden w-full lg:ml-auto lg:block lg:max-w-[24rem]">
          <Portrait sizes="384px" className="shadow-lg" />
        </div>
      </Container>
    </section>
  );
}

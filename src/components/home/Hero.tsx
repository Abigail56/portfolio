import Link from "next/link";
import { ArrowRight, Download, FileText, Mail, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Portrait } from "@/components/ui/Portrait";
import { Container } from "@/components/ui/Section";

const profileLink = "inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-muted transition-colors hover:text-fg";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20 lg:pb-24 lg:pt-20">
        <div className="max-lg:order-2">
          <h1 id="hero-title" className="text-hero text-fg">
            <span className="font-normal text-muted">Hi, I&apos;m </span>
            <span className="sm:block">{site.person.name}.</span>
          </h1>
          <p className="text-subtitle mt-5 text-accent">{site.person.role}</p>
          <p className="text-lead mt-6 max-w-[38rem] text-muted">
            I build modern web applications, responsive user interfaces, and reliable backend systems. I enjoy turning ideas into practical digital solutions
            through clean code, thoughtful engineering, and modern technologies. My focus is on developing secure, scalable, and user-friendly applications
            that solve real-world problems.
          </p>
          <p className="mt-6 font-mono text-[0.8125rem] font-semibold leading-relaxed text-fg">{site.coreTechnologies.join(" · ")}</p>

          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
            <ButtonLink href="#work" size="lg" className="group">
              Explore My Work
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={site.cv.href} download={site.cv.fileName} variant="secondary" size="lg">
              <Download aria-hidden className="size-4" />
              Download My CV
              <span className="sr-only">({site.cv.sizeLabel})</span>
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-0" aria-label="Profiles and contact">
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
            <li>
              <Link href={site.cv.viewHref} className={profileLink}>
                <FileText aria-hidden className="size-4" />
                View CV
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className={profileLink}>
                <Mail aria-hidden className="size-4" />
                Email
              </a>
            </li>
          </ul>
        </div>

        <figure className="w-full max-lg:order-1 max-lg:mx-auto max-lg:max-w-[16rem] lg:ml-auto lg:max-w-[22rem]">
          <Portrait eager sizes="(min-width: 1024px) 352px, 240px" />
          <figcaption className="mt-3 flex items-center justify-center gap-1.5 text-[0.8125rem] text-muted lg:justify-end">
            <MapPin aria-hidden className="size-3.5 text-subtle" />
            {site.person.location}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

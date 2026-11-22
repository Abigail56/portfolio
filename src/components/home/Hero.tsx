"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { ArrowDown, FileText } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export function Hero() {
  function moveHeroDepth(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--hero-x", `${(x * 14).toFixed(1)}px`);
    event.currentTarget.style.setProperty("--hero-y", `${(y * 10).toFixed(1)}px`);
  }

  function resetHeroDepth(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--hero-x", "0px");
    event.currentTarget.style.setProperty("--hero-y", "0px");
  }

  return (
    <section id="home" aria-labelledby="hero-title" onPointerMove={moveHeroDepth} onPointerLeave={resetHeroDepth} className="hero-system relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-line">
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="hero-glow hero-glow-one pointer-events-none absolute" />
      <div aria-hidden className="hero-glow hero-glow-two pointer-events-none absolute" />
      <Container className="relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:py-16">
        <div className="relative z-10 max-w-[48rem]">
          <p data-reveal className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.12em] text-accent">
            <span aria-hidden className="size-1.5 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" />
            Software · Systems · Backend
          </p>

          <h1 id="hero-title" className="mt-6 text-[clamp(3.1rem,7vw,5.8rem)] leading-[0.96] font-bold tracking-[-0.06em] text-fg">
            <span data-reveal style={{ transitionDelay: "80ms" }} className="block">Full-Stack</span>
            <span data-reveal style={{ transitionDelay: "140ms" }} className="block text-gradient">Software Engineer</span>
          </h1>

          <p data-reveal style={{ transitionDelay: "220ms" }} className="mt-7 max-w-[43rem] text-[clamp(1.05rem,2vw,1.25rem)] leading-8 text-muted">
            I build scalable applications and resilient backend systems that turn ideas into reliable digital products.
          </p>

          <div data-reveal style={{ transitionDelay: "300ms" }} className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
            <ButtonLink href="#projects" size="lg" className="group min-h-12 px-6">
              Explore My Work
              <ArrowDown aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-y-1" />
            </ButtonLink>
            <ButtonLink href={site.cv.viewHref} variant="secondary" size="lg" className="min-h-12 px-5">
              <FileText aria-hidden className="size-4" />
              View CV
            </ButtonLink>
          </div>

          <dl data-reveal style={{ transitionDelay: "380ms" }} className="mt-8 grid max-w-[43rem] grid-cols-3 border-y border-line py-4">
            <div className="border-r border-line pr-4">
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-subtle">Selected work</dt>
              <dd className="mt-1 text-lg font-semibold text-fg">5+ projects</dd>
            </div>
            <div className="border-r border-line px-4">
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-subtle">Core stack</dt>
              <dd className="mt-1 text-lg font-semibold text-fg">React + Python</dd>
            </div>
            <div className="pl-4">
              <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-subtle">Based in</dt>
              <dd className="mt-1 text-lg font-semibold text-fg">Nigeria</dd>
            </div>
          </dl>
        </div>

        <div data-reveal style={{ transitionDelay: "180ms" }} className="hero-portrait-wrap relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[38rem]" aria-label="Portrait of Chukwu Chinecherem">
          <div aria-hidden className="hero-orbit hero-orbit-outer" />
          <div aria-hidden className="hero-orbit hero-orbit-middle" />
          <div aria-hidden className="hero-orbit hero-orbit-inner" />
          <div aria-hidden className="hero-particle hero-particle-one" />
          <div aria-hidden className="hero-particle hero-particle-two" />
          <div aria-hidden className="hero-particle hero-particle-three" />
          <div className="portrait-flip-wrap hero-portrait absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full">
            <div className="portrait-flip-inner">
              <div className="portrait-face portrait-face-front">
                <Image src={site.photo.src ?? "/images/profile-chatgpt.jpg"} alt={site.photo.alt} fill sizes="(min-width: 1024px) 540px, 78vw" priority className="object-cover object-[50%_28%]" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,transparent_48%,var(--accent-soft)_100%)]" />
              </div>
              <div className="portrait-face portrait-face-back">
                <Image src="/images/profile-alternate.jpg" alt="Alternate portrait of Chukwu Chinecherem" fill sizes="(min-width: 1024px) 540px, 78vw" priority className="object-cover object-[50%_28%]" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(145deg,transparent_48%,var(--accent-soft)_100%)]" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-[8%] right-[2%] rounded-xl border border-line bg-surface/85 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted shadow-lg backdrop-blur-md">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-400" />
            Available to build
          </div>
        </div>

        <a href="#about" aria-label="Scroll to about" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted lg:flex">
          Scroll to explore
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line pt-1.5">
            <span className="size-1 rounded-full bg-accent motion-safe:animate-bounce" />
          </span>
        </a>
      </Container>
    </section>
  );
}

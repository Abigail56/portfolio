import { useState } from "react";
import { Download, Mail, Minus, Plus } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { site } from "@/config/site";
import cv from "@/content/cv.json";

// Page widths for the zoom control, in rem. The pages are vector SVGs, so text stays sharp at every size.
const ZOOM_LEVELS = [44, 52, 64, 80];
const DEFAULT_ZOOM = 1;

/** The CV, readable in any browser without downloading (pages rendered by scripts/render-cv.mjs). */
export default function CvPage() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const pageCount = cv.pages.length;
  const width = ZOOM_LEVELS[zoom] ?? 52;
  const percent = Math.round((width / ZOOM_LEVELS[DEFAULT_ZOOM]!) * 100);

  return (
    <>
      <Seo title="CV" description={`The CV of ${site.person.name}, ${site.person.role}. Read it online or download the PDF.`} />

      <header className="border-b border-line">
        <Container className="pb-10 pt-14 sm:pt-20">
          <p className="eyebrow">Curriculum vitae</p>
          <h1 className="mt-3 text-[2.375rem] font-semibold leading-[1.08] tracking-[-0.035em] text-fg sm:text-5xl lg:text-[3.5rem]">{site.person.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Read my CV right here, or download the PDF to keep a copy.
          </p>
        </Container>
      </header>

      {/* Stays visible while reading, so downloading is always one click away. */}
      <div className="sticky top-16 z-20 lg:top-[72px] border-b border-line bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-1" role="group" aria-label="Zoom">
            <Button variant="secondary" size="sm" aria-label="Zoom out" disabled={zoom === 0} onClick={() => setZoom(zoom - 1)}>
              <Minus aria-hidden className="size-4" />
            </Button>
            <span className="w-14 text-center text-sm tabular-nums text-muted" aria-live="polite">
              {percent}%
            </span>
            <Button variant="secondary" size="sm" aria-label="Zoom in" disabled={zoom === ZOOM_LEVELS.length - 1} onClick={() => setZoom(zoom + 1)}>
              <Plus aria-hidden className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href={site.cv.href} download={site.cv.fileName} size="sm">
              <Download aria-hidden className="size-4" />
              Download PDF
            </ButtonLink>
            <span className="hidden sm:inline">
              <ButtonLink href={site.cv.href} external variant="secondary" size="sm">
                Open PDF
              </ButtonLink>
            </span>
            <span className="hidden md:inline">
              <ButtonLink href="/contact" variant="ghost" size="sm">
                <Mail aria-hidden className="size-4" />
                Contact
              </ButtonLink>
            </span>
          </div>
        </Container>
      </div>

      {/* Wider zoom levels can exceed a phone's width; this area scrolls sideways instead of the page. */}
      <div className="mt-10 overflow-x-auto px-5 pb-2 sm:px-8">
        <ol className="mx-auto grid grid-cols-[minmax(0,1fr)] gap-8 transition-[max-width] duration-300" style={{ maxWidth: `${width}rem`, minWidth: zoom > DEFAULT_ZOOM ? `${width * 0.75}rem` : undefined }}>
          {cv.pages.map((page, i) => (
            <li key={page.svg}>
              <figure className="overflow-hidden rounded-md bg-white shadow-[0_1px_3px_rgb(15_23_42/0.08),0_20px_50px_-20px_rgb(15_23_42/0.25)] ring-1 ring-line">
                <picture>
                  <source srcSet={page.svg} type="image/svg+xml" />
                  {/* Plain <img>: the SVG is already resolution-independent, so Next's raster optimiser would only blur it. */}
                  <img
                    src={page.png}
                    alt={`CV page ${i + 1} of ${pageCount}. The full text is available below.`}
                    width={page.width}
                    height={page.height}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </picture>
              </figure>
              <p className="mt-3 text-center text-xs text-subtle">
                Page {i + 1} of {pageCount}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <Container>
        <details className="mx-auto mt-10 max-w-[52rem] rounded-xl card p-5 shadow-sm">
          <summary className="cursor-pointer font-medium text-fg">Text version of the CV</summary>
          <div className="mt-4 grid gap-6">
            {cv.text.map((pageText, i) => (
              <pre key={i} className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-muted">
                {pageText}
              </pre>
            ))}
          </div>
        </details>

        <div className="mx-auto mt-10 flex max-w-[52rem] flex-wrap items-center justify-center gap-3">
          <ButtonLink href={site.cv.href} download={site.cv.fileName}>
            <Download aria-hidden className="size-4" />
            Download CV (PDF)
          </ButtonLink>
          <ButtonLink href={site.cv.href} external variant="secondary">
            Open in a new tab
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}

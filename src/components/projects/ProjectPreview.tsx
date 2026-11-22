"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ProjectPreviewProps {
  project: Project;
  sizes: string;
  /** Load immediately: for the most prominent image on the page (Next 16 deprecates `priority`). */
  eager?: boolean;
  className?: string;
  /** Show where the screenshot was captured, under the image. */
  caption?: boolean;
}

/** A real screenshot with a thin border, and optionally a caption saying where it was captured. */
export function ProjectPreview({ project, sizes, eager, className, caption }: ProjectPreviewProps) {
  const shot = project.screenshot;

  function movePreview(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--preview-rx", `${(-y * 5).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--preview-ry", `${(x * 7).toFixed(2)}deg`);
  }

  function resetPreview(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--preview-rx", "0deg");
    event.currentTarget.style.setProperty("--preview-ry", "0deg");
  }
  if (!shot) return null;
  return (
    <figure className={className}>
      <div
        className="project-preview relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-surface-2"
        onPointerMove={movePreview}
        onPointerLeave={resetPreview}
        style={shot.backdrop ? { backgroundColor: shot.backdrop } : undefined}
      >
        <Image
          src={shot.desktop}
          alt={shot.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover object-top"
        />
      </div>
      {caption && <figcaption className={cn("mt-2.5 text-xs text-subtle")}>Screenshot captured from {shot.capturedFrom}.</figcaption>}
    </figure>
  );
}

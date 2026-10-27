import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** The portrait from site.photo in a fine-bordered frame, or a monogram in the same frame until a photo is added. */
export function Portrait({ className, sizes, eager }: { className?: string; sizes: string; eager?: boolean }) {
  const { src, alt } = site.photo;
  const initials = site.person.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <div className={cn("rounded-[1.25rem] border border-line bg-surface p-1.5", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[0.875rem] bg-surface-2">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="object-cover"
          />
        ) : (
          <div role="img" aria-label={site.person.name} className="grid h-full place-items-center bg-surface-3">
            <span className="text-6xl font-semibold tracking-tight text-subtle">{initials}</span>
          </div>
        )}
      </div>
    </div>
  );
}

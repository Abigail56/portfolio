import Link from "next/link";
import { site } from "@/config/site";

/** The header wordmark: a monogram and the person's name (the name is visually hidden on phones, where the header has less room). */
export function BrandMark() {
  const initials = site.person.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-md px-1.5 text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-fg">
      <span aria-hidden className="grid size-9 place-items-center rounded-md border border-accent-line bg-accent-soft text-[0.75rem] font-semibold tracking-normal text-accent">
        {initials}
      </span>
      <span className="pr-1 max-[439px]:hidden">{site.person.name}</span>
    </Link>
  );
}

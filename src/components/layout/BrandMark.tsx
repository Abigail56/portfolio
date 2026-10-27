import Link from "next/link";
import { site } from "@/config/site";

/** The header wordmark: a monogram and the person's name (the name hides on very narrow screens). */
export function BrandMark() {
  const initials = site.person.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <Link href="/" className="inline-flex items-center gap-3 rounded-md text-[0.9375rem] font-semibold tracking-[-0.01em] text-fg">
      <span aria-hidden className="grid size-9 place-items-center rounded-lg border border-line-strong bg-surface-2 text-[0.8125rem] font-semibold tracking-normal text-fg">
        {initials}
      </span>
      <span className="max-[359px]:sr-only">{site.person.name}</span>
    </Link>
  );
}

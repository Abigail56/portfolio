import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** A quiet status line: a small dot and plain text, linking to the contact page. */
export function AvailabilityBadge({ className }: { className?: string }) {
  if (!site.openToOpportunities) return null;
  return (
    <Link href="/contact" className={cn("inline-flex items-center gap-2 text-sm text-muted hover:text-fg", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      Available for work
    </Link>
  );
}

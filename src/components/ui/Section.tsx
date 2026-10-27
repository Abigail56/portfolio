import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  action?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
}

export function SectionHeader({ eyebrow, title, lead, action, id, as: Heading = "h2" }: SectionHeaderProps) {
  return (
    <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Heading id={id} className="text-title text-fg">
          {title}
        </Heading>
        {lead && <p className="text-lead mt-4 text-muted">{lead}</p>}
      </div>
      {action && <div className="shrink-0 sm:pb-1.5">{action}</div>}
    </div>
  );
}

/** The opening band shared by inner pages: a label, a large title and a short introduction. */
export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="border-b border-line">
      <Container className="pb-14 pt-16 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="text-display mt-4 max-w-[16em] text-fg">{title}</h1>
        {lead && <div className="text-lead mt-6 max-w-[40rem] text-muted">{lead}</div>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}

/** A thin rule with a label, used to separate the parts of a page. */
export function SectionLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="eyebrow border-b border-line pb-3">
      {children}
    </h2>
  );
}

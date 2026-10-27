import Link from "next/link";
import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium tracking-[0.005em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent-solid text-on-accent shadow-sm hover:bg-accent-solid-hover",
  secondary: "border border-line-strong bg-surface text-fg hover:border-accent-line hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5",
  md: "h-10 px-4",
  lg: "h-11 px-5",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Opens in a new tab with an outbound icon and a screen-reader hint. */
  external?: boolean;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, external, className, children, ...props }: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
        <ArrowUpRight aria-hidden className="size-4 opacity-70" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  // Files such as the CV are plain links so the browser handles the download.
  if (href.startsWith("/") && !href.endsWith(".pdf")) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}

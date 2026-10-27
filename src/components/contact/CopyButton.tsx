import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

/** Copies `value` to the clipboard. With `text`, it's a full secondary button showing that text; otherwise an icon. */
export function CopyButton({ value, label, text }: { value: string; label: string; text?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  const icon = state === "copied" ? <Check aria-hidden className="size-4 text-success" /> : <Copy aria-hidden className="size-4" />;
  const status = (
    <span className="sr-only" aria-live="polite">
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""}
    </span>
  );

  if (text) {
    return (
      <button type="button" onClick={copy} className={buttonClasses("secondary", "lg")}>
        {icon}
        <span aria-hidden>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : text}</span>
        <span className="sr-only">{label}</span>
        {status}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-3 hover:text-fg"
      aria-label={label}
    >
      {icon}
      {status}
    </button>
  );
}

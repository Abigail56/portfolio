import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CodeSnippet } from "@/lib/types";

export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 2000);
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-code-bg">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-code-fg">{snippet.title}</span>
          <span className="block truncate font-mono text-[0.6875rem] text-[#8d9ab3]">{snippet.source}</span>
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#aab6cc] hover:bg-white/10 hover:text-white"
        >
          {copied === "copied" ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
          <span aria-live="polite">{copied === "copied" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed text-code-fg" tabIndex={0} aria-label={`Code: ${snippet.title}`}>
        <code>{snippet.code}</code>
      </pre>
      {snippet.note && <p className="border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-[#aab6cc]">{snippet.note}</p>}
    </figure>
  );
}

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { completeCommand, runCommand, type TerminalLine } from "@/lib/terminal";
import { cn } from "@/lib/cn";

interface Entry {
  id: number;
  input?: string;
  lines: TerminalLine[];
}

const PROMPT = "visitor@chinecherem.dev:~$";
const SUGGESTIONS = ["help", "about", "projects", "skills", "contact", "cv"];
const WELCOME: Entry = {
  id: 0,
  lines: [
    { text: "Portfolio terminal. Every answer comes from this site's own content.", tone: "accent" },
    { text: "Type 'help' to see the commands, or tap a suggestion below.", tone: "muted" },
  ],
};

const toneClass: Record<NonNullable<TerminalLine["tone"]>, string> = {
  default: "text-code-fg",
  muted: "text-[#8d9ab3]",
  accent: "text-[#8fb0ff]",
  success: "text-[#5fd99f]",
  error: "text-[#f59a9a]",
};

function OutputLine({ line }: { line: TerminalLine }) {
  const className = cn("whitespace-pre-wrap break-words", toneClass[line.tone ?? "default"]);
  if (!line.href) return <p className={className}>{line.text || " "}</p>;
  const external = /^(https?:|mailto:|tel:)/.test(line.href);
  return (
    <p className={className}>
      {external ? (
        <a href={line.href} target={line.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">
          {line.text}
        </a>
      ) : (
        <Link href={line.href} className="underline decoration-white/30 underline-offset-2 hover:decoration-white">
          {line.text}
        </Link>
      )}
    </p>
  );
}

export function DevTerminal() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const inputId = useId();

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function execute(raw: string) {
    const command = raw.trim();
    const result = runCommand(command);
    if (command) setHistory((h) => [...h, command]);
    setHistoryIndex(null);
    setInput("");

    if (result.action?.type === "clear") {
      setEntries([]);
      return;
    }
    setEntries((prev) => [...prev, { id: nextId.current++, input: raw, lines: result.lines }]);

    if (result.action?.type === "navigate") {
      const href = result.action.href;
      window.setTimeout(() => void router.push(href), 350);
    } else if (result.action?.type === "download") {
      const link = document.createElement("a");
      link.href = result.action.href;
      link.download = "";
      link.click();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    execute(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && input.trim()) {
      e.preventDefault();
      setInput(completeCommand(input));
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(i);
      setInput(history[i] ?? "");
    } else if (e.key === "ArrowDown" && historyIndex !== null) {
      e.preventDefault();
      const i = historyIndex + 1;
      if (i >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(i);
        setInput(history[i] ?? "");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-xl border border-line bg-code-bg shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="font-mono text-xs text-[#8d9ab3]">chinecherem.dev: terminal</span>
          <span className="font-mono text-[0.6875rem] text-[#5d6a84]">read-only · no system access</span>
        </div>
        {/* Clicking anywhere in the output focuses the prompt, like a real terminal. */}
        <div ref={scrollRef} onClick={() => inputRef.current?.focus()} className="h-[26rem] overflow-y-auto p-4 font-mono text-[0.8125rem] leading-relaxed">
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {entries.map((entry) => (
              <div key={entry.id} className="mb-3">
                {entry.input !== undefined && (
                  <p className="text-code-fg">
                    <span className="text-[#5fd99f]">{PROMPT}</span> {entry.input}
                  </p>
                )}
                {entry.lines.map((line, i) => (
                  <OutputLine key={i} line={line} />
                ))}
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <label htmlFor={inputId} className="shrink-0 text-[#5fd99f]">
              {PROMPT}
              <span className="sr-only"> Enter a command</span>
            </label>
            <input
              ref={inputRef}
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              maxLength={120}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-code-fg caret-[#8fb0ff] outline-none"
            />
          </form>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-subtle">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              execute(s);
              inputRef.current?.focus();
            }}
            className="rounded-md glass-card px-2.5 py-1 font-mono text-xs text-muted hover:border-accent-line hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-subtle">
        Keys: <kbd className="rounded border border-line px-1 font-mono text-xs">Tab</kbd> completes,{" "}
        <kbd className="rounded border border-line px-1 font-mono text-xs">↑</kbd>{" "}
        <kbd className="rounded border border-line px-1 font-mono text-xs">↓</kbd> recall history,{" "}
        <kbd className="rounded border border-line px-1 font-mono text-xs">Ctrl</kbd>+<kbd className="rounded border border-line px-1 font-mono text-xs">L</kbd> clears. Tab only completes when there is text, so it still moves focus out of an empty prompt.
      </p>
    </div>
  );
}

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      aria-label={theme ? `Switch to ${next} theme` : "Switch theme"}
      title={theme ? `Switch to ${next} theme` : undefined}
    >
      {/* Before hydration the theme is unknown, so both icons stay hidden to avoid showing the wrong one. */}
      <Sun aria-hidden className={theme === "dark" ? "size-[18px]" : "hidden"} />
      <Moon aria-hidden className={theme === "light" ? "size-[18px]" : "hidden"} />
    </button>
  );
}

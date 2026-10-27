import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the page paints (see _document.tsx), so there is no flash of the wrong theme.
// Light is the default; a visitor who picks dark keeps it. It also marks that JavaScript is running,
// which the scroll-reveal styles rely on (without JS, nothing is hidden).
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s==="dark"?"dark":"light";document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}document.documentElement.classList.add("js");})();`;

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** The current theme, or null during server rendering (the real value is only known in the browser). */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The choice just won't be remembered.
  }
}

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Reads the colour tokens straight from globals.css and checks WCAG AA contrast (4.5:1 for text)
// for every text colour on every background, in both themes.
const css = readFileSync(path.join(process.cwd(), "src/styles/globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2]]));
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const themes = { light: block(":root"), dark: block(':root[data-theme="dark"]') };
const textTokens = ["fg", "muted", "subtle", "accent", "cyan", "success", "warning", "danger"];
const backgrounds = ["bg", "surface", "surface-2"];

describe.each(Object.entries(themes))("%s theme", (_name, tokens) => {
  it.each(textTokens)("%s text is readable on every background", (token) => {
    for (const bg of backgrounds) {
      const ratio = contrast(tokens[token]!, tokens[bg]!);
      expect(ratio, `${token} on ${bg}: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("button text is readable on the solid accent", () => {
    for (const bg of ["accent-solid", "accent-solid-hover"]) {
      expect(contrast(tokens["on-accent"]!, tokens[bg]!)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("code text is readable on the code background", () => {
    expect(contrast(tokens["code-fg"]!, tokens["code-bg"]!)).toBeGreaterThanOrEqual(7);
  });
});

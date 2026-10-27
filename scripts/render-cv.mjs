// Renders the CV PDF for the /cv page, so it can be read in any browser (phones often download PDFs
// instead of showing them).
//   node scripts/render-cv.mjs          (run again whenever public/cv/Chinecherem-Chukwu-CV.pdf changes)
//
// Each page becomes a vector SVG (sharp at any zoom level and screen density) plus a high-resolution PNG
// used as a fallback. The text is extracted for the accessible text version.
// Needs poppler-utils (pdftocairo, pdftoppm, pdftotext). Outputs public/cv/page-N.svg|png and src/content/cv.json.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "cv");
const pdf = path.join(outDir, "Chinecherem-Chukwu-CV.pdf");
const work = mkdtempSync(path.join(tmpdir(), "cv-"));

try {
  // Remove pages from an earlier render, in case the CV got shorter.
  for (const f of readdirSync(outDir)) if (/^page-\d+\.(svg|png|webp)$/.test(f)) unlinkSync(path.join(outDir, f));

  const info = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
  const count = Number(/Pages:\s+(\d+)/.exec(info)?.[1] ?? 0);
  const [, w, h] = /Page size:\s+([\d.]+) x ([\d.]+)/.exec(info) ?? [];

  const pages = [];
  for (let n = 1; n <= count; n++) {
    execFileSync("pdftocairo", ["-svg", "-f", String(n), "-l", String(n), pdf, path.join(outDir, `page-${n}.svg`)]);
    // 220 dpi PNG fallback: crisp at 2x on a typical 830px-wide column.
    execFileSync("pdftoppm", ["-r", "220", "-png", "-singlefile", "-f", String(n), "-l", String(n), pdf, path.join(work, `p${n}`)]);
    const png = await sharp(path.join(work, `p${n}.png`)).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(path.join(outDir, `page-${n}.png`));
    pages.push({ svg: `/cv/page-${n}.svg`, png: `/cv/page-${n}.png`, width: png.width, height: png.height });
  }

  // Text per page (pdftotext separates pages with a form feed), with blank lines collapsed.
  const text = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" })
    .split("\f")
    .map((page) => page.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim())
    .filter(Boolean);

  writeFileSync(
    path.join(root, "src", "content", "cv.json"),
    JSON.stringify({ pageSize: { width: Number(w), height: Number(h) }, pages, text }, null, 2) + "\n",
  );
  console.log(`Rendered ${pages.length} pages as SVG + PNG (${pages.map((p) => `${p.width}×${p.height}`).join(", ")})`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

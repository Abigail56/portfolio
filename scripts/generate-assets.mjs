// Generates the favicon set (from public/favicon.svg) and the social preview image.
//   node scripts/generate-assets.mjs
// Outputs: public/favicon.ico (PNG inside an ICO container), public/apple-touch-icon.png, public/og.png

import { chromium } from "playwright-core";
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pub = (f) => path.join(root, "public", f);
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

async function icons() {
  const svg = await readFile(pub("favicon.svg"));
  const png32 = await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer();
  // ICO header + one directory entry pointing at an embedded PNG (supported by every current browser).
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png32.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(pub("favicon.ico"), Buffer.concat([header, entry, png32]));

  // Apple touch icons should not be transparent; the mark's square already fills the canvas.
  await sharp(svg, { density: 1200 }).resize(180, 180).flatten({ background: "#3549d8" }).png().toFile(pub("apple-touch-icon.png"));
}

async function ogImage() {
  // Inlined as data URIs: a page created with setContent has no origin, so file:// fonts would be blocked.
  const fontData = {};
  for (const f of ["Inter-latin.woff2"]) {
    fontData[f] = `data:font/woff2;base64,${(await readFile(path.join(root, "src", "fonts", f))).toString("base64")}`;
  }
  const font = (f) => fontData[f];
  const photo = `data:image/jpeg;base64,${(await readFile(pub("images/profile.jpg"))).toString("base64")}`;
  const html = `<!doctype html><html><head><style>
    @font-face { font-family: Body; src: url(${font("Inter-latin.woff2")}); font-weight: 100 900; }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: #f4f7fc; color: #192235; font-family: Body; display: flex; overflow: hidden; position: relative; }
    .text { padding: 84px 0 76px 88px; display: flex; flex-direction: column; width: 770px; }
    .hello { font-size: 24px; font-weight: 600; letter-spacing: -.005em; }
    .hello span { color: #3549d8; font-weight: 500; }
    h1 { font-size: 62px; line-height: 1.06; letter-spacing: -.04em; margin-top: 30px; font-weight: 620; }
    p { margin-top: auto; font-size: 24px; color: #586780; }
    .photo { position: absolute; right: 88px; top: 84px; width: 300px; height: 375px; border-radius: 16px; padding: 6px;
      background: #fff; border: 1px solid #d8e0ed; box-shadow: 0 24px 48px -24px rgba(25,34,53,.25); }
    .photo div { width: 100%; height: 100%; border-radius: 11px; background: url(${photo}) center/cover; }
  </style></head><body>
    <div class="text">
      <div class="hello">Chukwu Chinecherem <span>· Full-Stack Software Engineer</span></div>
      <h1>Building thoughtful digital products, from frontend to backend.</h1>
      <p>Port Harcourt, Nigeria · React, Next.js, Python, FastAPI</p>
    </div>
    <div class="photo"><div></div></div>
  </body></html>`;
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: pub("og.png"), type: "png" });
  } finally {
    await browser.close();
  }
}

await icons();
await ogImage();
console.log("Generated favicon.ico, apple-touch-icon.png and og.png");

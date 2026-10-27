// Captures real screenshots of each project into public/projects/.
//
//   npm run screenshots                     # every target that is reachable
//   npm run screenshots -- routebridge iotc # only these slugs
//
// Live sites are captured from their public URLs. Projects that are not deployed are captured from a
// local copy: set the matching environment variable to the file or dev-server URL, otherwise it is skipped.
//   VOTINGUI_DOM_URL=file:///path/to/VotingUI-DOM/index.html
//   BEAN_BREW_URL=file:///path/to/Bean-Brew/tailwind-assignment.html
//   VOXPLAY_URL=http://localhost:3010
//
// Uses the Chrome already installed on this machine (CHROME_PATH to override), so no browser download is needed.

import { chromium } from "playwright-core";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "projects");
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

const TARGETS = [
  { slug: "routebridge", url: "https://routebridge-web.onrender.com/" },
  { slug: "voxplay", url: process.env.VOXPLAY_URL },
  { slug: "iotc-landing-page", url: "https://iotc-landing-page.vercel.app/" },
  { slug: "votingui-nextjs", url: "https://voting-ui-next-js.vercel.app/" },
  { slug: "votingui-dom", url: process.env.VOTINGUI_DOM_URL },
  { slug: "bean-brew", url: process.env.BEAN_BREW_URL },
];

const VIEWPORTS = [
  { suffix: "", width: 1440, height: 900 },
  { suffix: "-mobile", width: 390, height: 844 },
];

const only = process.argv.slice(2);

async function main() {
  if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}. Set CHROME_PATH.`);
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    for (const target of TARGETS) {
      if (only.length && !only.includes(target.slug)) continue;
      if (!target.url) {
        console.log(`skip  ${target.slug}: no URL configured`);
        continue;
      }
      for (const vp of VIEWPORTS) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
        try {
          // Free hosting tiers can take a while to wake up.
          await page.goto(target.url, { waitUntil: "networkidle", timeout: 90_000 });
          await page.waitForTimeout(1500);
          const file = path.join(OUT_DIR, `${target.slug}${vp.suffix}.jpg`);
          await page.screenshot({ path: file, type: "jpeg", quality: 82 });
          console.log(`ok    ${target.slug}${vp.suffix} <- ${target.url}`);
        } catch (err) {
          console.log(`fail  ${target.slug}${vp.suffix}: ${err.message.split("\n")[0]}`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

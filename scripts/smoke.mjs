// Browser smoke test against a running build.
//   npm run build && npm start         (in one terminal)
//   npm run test:e2e                   (in another; BASE_URL defaults to http://localhost:3000)
//
// For every route, at phone and desktop width and in both themes, it checks: no console errors or page
// errors, no horizontal scrolling, no broken images, a single h1, and that internal links resolve.
// Then it drives the interactive parts: mobile menu, theme toggle, filters, terminal, games and contact form.

import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";

const routes = [
  "/",
  "/projects",
  "/projects/routebridge",
  "/projects/voxplay",
  "/projects/votingui-nextjs",
  "/projects/iotc-landing-page",
  "/projects/votingui-dom",
  "/projects/bean-brew",
  "/projects/echovault-nexus",
  "/engineering",
  "/playground",
  "/playground/developers-mind",
  "/playground/brain-clash",
  "/playground/snake",
  "/playground/code-quest",
  "/playground/bug-hunter",
  "/playground/memory-match",
  "/playground/terminal",
  "/about",
  "/contact",
  "/cv",
];
const viewports = [
  { name: "phone", width: 360, height: 780 },
  { name: "desktop", width: 1440, height: 900 },
];

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

async function newPage(browser, viewport, theme) {
  const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce" });
  // Dark is the site's default; light is what a visitor gets after choosing it with the toggle.
  if (theme === "light") await context.addInitScript(() => localStorage.setItem("theme", "light"));
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return { page, context, errors };
}

async function checkRoutes(browser) {
  const internalLinks = new Set();
  for (const theme of ["dark", "light"]) {
    for (const vp of viewports) {
      console.log(`\nRoutes · ${vp.name} ${vp.width}px · ${theme}`);
      const { page, context, errors } = await newPage(browser, vp, theme);
      for (const route of routes) {
        errors.length = 0;
        const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
        if (!res || res.status() !== 200) fail(`${route}: HTTP ${res?.status()}`);
        const report = await page.evaluate(() => {
          const imgs = [...document.images].filter((i) => i.loading !== "lazy" || i.getBoundingClientRect().top < innerHeight);
          return {
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
            h1: document.querySelectorAll("h1").length,
            theme: document.documentElement.dataset.theme,
            title: document.title,
            links: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
          };
        });
        report.links.forEach((l) => internalLinks.add(l.split("#")[0]));
        const problems = [];
        if (report.overflow > 0) problems.push(`horizontal overflow ${report.overflow}px`);
        if (report.brokenImages.length) problems.push(`broken images ${report.brokenImages.join(", ")}`);
        if (report.h1 !== 1) problems.push(`${report.h1} h1 elements`);
        if (report.theme !== theme) problems.push(`theme is ${report.theme}`);
        if (errors.length) problems.push(`console: ${errors.join(" | ")}`);
        if (problems.length) fail(`${route}: ${problems.join("; ")}`);
        else pass(`${route} (${report.title})`);
      }
      await context.close();
    }
  }
  return internalLinks;
}

async function checkLinks(links) {
  console.log("\nInternal links");
  for (const href of links) {
    const res = await fetch(BASE + href, { redirect: "manual" });
    if (res.status !== 200) fail(`${href}: HTTP ${res.status}`);
  }
  pass(`${links.size} internal links resolve`);

  const cv = await fetch(`${BASE}/cv/Chinecherem-Chukwu-CV.pdf`);
  const type = cv.headers.get("content-type");
  if (cv.status === 200 && type?.includes("pdf")) pass(`CV download: ${type}, ${(await cv.arrayBuffer()).byteLength} bytes`);
  else fail(`CV download: HTTP ${cv.status} ${type}`);

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  if (sitemap.includes("/projects/routebridge</loc>") && robots.includes("Sitemap:")) pass("sitemap.xml lists the pages and robots.txt points to it");
  else fail("sitemap.xml or robots.txt is wrong");

  const missing = await fetch(`${BASE}/this-page-does-not-exist`);
  const body = await missing.text();
  if (missing.status === 404 && body.includes("Page not found")) pass("unknown routes return the custom 404 page with status 404");
  else fail(`404 page: HTTP ${missing.status}`);
}

async function checkInteractions(browser) {
  console.log("\nInteractions");
  const { page, context, errors } = await newPage(browser, { width: 390, height: 844 }, "dark");

  // Mobile menu: opens, is labelled, closes on Escape and after navigating.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // The toggle's accessible name changes between "Open menu" and "Close menu", so locate it by aria-controls.
  const toggle = page.locator("header button[aria-controls]");
  await toggle.click();
  if ((await toggle.getAttribute("aria-expanded")) !== "true") fail("mobile menu: aria-expanded not true");
  await page.keyboard.press("Escape");
  const focusedToggle = await page.evaluate(() => document.activeElement?.hasAttribute("aria-controls"));
  if ((await toggle.getAttribute("aria-expanded")) === "false" && focusedToggle) pass("mobile menu opens, closes on Escape and returns focus to the toggle");
  else fail("mobile menu did not close on Escape");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Main (mobile)" }).getByRole("link", { name: "Projects" }).click();
  await page.waitForURL("**/projects");
  if (await page.locator("[aria-label='Main (mobile)']").isVisible()) fail("mobile menu stayed open after navigation");
  else pass("mobile menu closes after navigation");

  // Theme toggle persists across reloads.
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload({ waitUntil: "networkidle" });
  if ((await page.evaluate(() => document.documentElement.dataset.theme)) === "light") pass("theme choice persists after reload");
  else fail("theme did not persist");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();

  // Hero actions: each does what its label says.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hero = page.locator("section[aria-labelledby='hero-title']");
  const heroCv = hero.getByRole("link", { name: /Download CV/ });
  const heroLinks = {
    projects: await hero.getByRole("link", { name: "Explore Projects" }).getAttribute("href"),
    cv: await heroCv.getAttribute("href"),
    cvDownload: await heroCv.getAttribute("download"),
    github: await hero.getByRole("link", { name: /View GitHub/ }).getAttribute("href"),
    linkedin: await hero.getByRole("link", { name: /Connect on LinkedIn/ }).getAttribute("href"),
  };
  const [download] = await Promise.all([page.waitForEvent("download"), heroCv.click()]);
  if (
    heroLinks.projects === "#work" &&
    heroLinks.cv?.endsWith(".pdf") &&
    heroLinks.cvDownload &&
    download.suggestedFilename().endsWith(".pdf") &&
    heroLinks.github?.startsWith("https://github.com/") &&
    heroLinks.linkedin?.startsWith("https://www.linkedin.com/")
  )
    pass(`hero actions: projects, CV download (${download.suggestedFilename()}), GitHub and LinkedIn`);
  else fail(`hero actions: ${JSON.stringify(heroLinks)}`);
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  if (jsonLd && JSON.parse(jsonLd)["@type"] === "Person") pass("home page has Person structured data");
  else fail("home page structured data missing or invalid");

  // The Developer's Mind: five challenges answered from the keyboard, then results and replay.
  await page.goto(BASE + "/playground/developers-mind", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Play now" }).click();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("1");
    await page.getByText(/^(Correct\.|Not quite\.)/).first().waitFor();
    await page.keyboard.press("Enter");
  }
  if (await page.getByText(/of 5 correct/).isVisible()) pass("The Developer's Mind plays five challenges by keyboard and shows results");
  else fail("The Developer's Mind did not reach results");
  await page.getByRole("button", { name: "Play again" }).click();
  if (await page.getByText(/Challenge\s*1\s*of 5/).isVisible()) pass("The Developer's Mind replay restarts at challenge 1");
  else fail("The Developer's Mind replay");

  // Brain Clash Mini: the timer runs out on its own and stops; two-player mode alternates turns.
  await page.goto(BASE + "/playground/brain-clash", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start round" }).click();
  await page.getByText(/Time's up/).waitFor({ timeout: 20000 });
  const frozen = await page.getByText(/^\d+s/).first().innerText();
  await page.waitForTimeout(1200);
  if ((await page.getByText(/^\d+s/).first().innerText()) === frozen) pass("Brain Clash Mini times out, then the timer stops");
  else fail("Brain Clash Mini timer kept running after the question ended");
  await page.goto(BASE + "/playground/brain-clash", { waitUntil: "networkidle" });
  await page.getByText("Two players", { exact: true }).click();
  await page.getByRole("button", { name: "Start round" }).click();
  await page.locator("main ul button").first().click();
  await page.getByRole("button", { name: "Pass to Player 2" }).click();
  if (await page.getByText("Player 2's turn").isVisible()) pass("Brain Clash Mini two-player mode passes the turn");
  else fail("Brain Clash Mini two-player turn");

  // Projects page: two featured projects and a card for each of the rest, each linking to its case study.
  await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
  const featuredCount = await page.locator("main article[aria-labelledby]").count();
  const rowCount = await page.locator("main li > article h3 a").count();
  if (featuredCount === 2 && rowCount === 5) pass("Projects page shows 2 featured projects and 5 others");
  else fail(`Projects page: ${featuredCount} featured, ${rowCount} cards`);

  // Terminal: real answers, unknown commands are refused.
  await page.goto(BASE + "/playground/terminal", { waitUntil: "networkidle" });
  const input = page.getByLabel(/Enter a command/);
  await input.fill("contact");
  await input.press("Enter");
  await input.fill("rm -rf /");
  await input.press("Enter");
  const log = await page.getByRole("log").innerText();
  if (log.includes("chinecheremchukwu15@gmail.com") && log.includes("command not found: rm")) pass("terminal answers 'contact' and refuses unknown commands");
  else fail("terminal output unexpected");
  await input.fill("open about");
  await input.press("Enter");
  await page.waitForURL("**/about");
  pass("terminal 'open about' navigates");

  // Code Quest: play a full round with the keyboard-reachable buttons, then replay.
  await page.goto(BASE + "/playground/code-quest", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start" }).click();
  for (let i = 0; i < 12; i++) {
    await page.locator("main ul button").first().click();
    await page.getByRole("button", { name: /Next question|See results/ }).click();
  }
  if (await page.getByText("Final score").isVisible()) pass("Code Quest plays through to a final score");
  else fail("Code Quest did not finish");
  await page.getByRole("button", { name: "Play again" }).click();
  if (await page.getByText("Question 1 of 12").isVisible()) pass("Code Quest replay restarts at question 1");
  else fail("Code Quest replay");

  // Bug Hunter: picking the right line reveals the explanation.
  await page.goto(BASE + "/playground/bug-hunter", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start" }).click();
  const title = await page.locator("main h2").first().innerText();
  const bugLines = { "The election with a missing candidate": 6, "Another company's delivery": 4, "A search that runs your SQL": 3, "Saved… or not yet?": 2, "The list that won't update": 4, "Page one starts on page two": 2 };
  await page.getByRole("button", { name: new RegExp(`^Line ${bugLines[title]}:`) }).click();
  if (await page.getByText(/Found it on the first try/).isVisible()) pass(`Bug Hunter accepts the right line ("${title}")`);
  else fail("Bug Hunter did not accept the right line");

  // Memory Match: starts and flips cards.
  await page.goto(BASE + "/playground/memory-match", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("button", { name: "Card 1, face down" }).click();
  if (await page.getByRole("button", { name: /^Card 1: / }).isVisible()) pass("Memory Match flips a card and announces its text");
  else fail("Memory Match flip");

  // Contact form: client validation, then an honest error when email isn't configured.
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send message" }).click();
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (focused === "contact-name" && (await page.getByText("Please enter your name.").isVisible())) pass("contact form validates and focuses the first invalid field");
  else fail(`contact validation (focused ${focused})`);
  // Unless SMOKE_SEND_EMAIL=1, the API is stubbed so a run never sends real email when Resend is configured.
  // Both outcomes are checked: the honest failure (stubbed 503) and, when sending for real, the success panel.
  const sendForReal = process.env.SMOKE_SEND_EMAIL === "1";
  if (!sendForReal) {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, reason: "not-configured", error: "The contact form isn't connected to email on this deployment yet, so your message was not sent." }),
      }),
    );
  }
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Smoke Test");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("smoke@example.com");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("This is an automated smoke test of the contact form.");
  const sendButton = page.getByRole("button", { name: "Send message" });
  await sendButton.click();
  // Scoped to <main>: Next.js also renders an (empty) route announcer with role="alert".
  const outcome = page.locator("main [role=alert], main [role=status]").first();
  await outcome.waitFor();
  const outcomeText = await outcome.innerText();
  const sent = await page.getByText("Message sent").count();
  if (sent === 0 && /not sent|wasn't sent|was not sent/.test(outcomeText)) pass(`contact form reports the failure honestly: "${outcomeText.split("\n")[0]}"`);
  else if (sent > 0 && sendForReal) pass("contact form sent a real message and shows the success state");
  else fail(`contact form: unexpected state "${outcomeText}"`);
  if (!sendForReal) await page.unroute("**/api/contact");

  // The contact API answering 503 (email not configured) is expected here; the browser logs it as a failed resource.
  const unexpected = errors.filter((e) => !e.includes("/api/contact") && !e.includes("status of 503"));
  if (unexpected.length) fail(`console errors during interactions: ${unexpected.join(" | ")}`);
  await context.close();
}

async function checkCv(browser) {
  console.log("\nCV");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", acceptDownloads: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "CV", exact: true }).click();
  await page.waitForURL("**/cv");
  const pages = await page.locator("main figure img").evaluateAll((imgs) => imgs.map((i) => i.naturalWidth));
  const download = await page.locator('main a[download][href$=".pdf"]').count();
  if (pages.length === 2 && download > 0) pass(`CV opens in the browser (${pages.length} pages) with a download button`);
  else fail(`CV page: ${pages.length} pages, ${download} download links`);
  await page.locator("main figure img").last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const loaded = await page.locator("main figure img").evaluateAll((imgs) => imgs.every((i) => i.complete && i.naturalWidth > 0));
  if (loaded) pass("both CV pages load");
  else fail("a CV page image did not load");
  const headerDownload = await page.locator('header a[download][href$=".pdf"]').count();
  if (headerDownload > 0) pass("the header keeps a Download CV button");
  else fail("no Download CV button in the header");
  await ctx.close();
}

async function checkSnake(browser) {
  console.log("\nSnake game");
  const reduced = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const rp = await reduced.newPage();

  // The playable version in the Lab.
  await rp.goto(BASE + "/playground/snake", { waitUntil: "networkidle" });
  await rp.getByRole("button", { name: "Start game" }).click();
  await rp.waitForTimeout(300);
  // Starting focuses the board (which may scroll it into view); after that, arrow keys must not scroll.
  const before = await rp.evaluate(() => window.scrollY);
  await rp.keyboard.press("ArrowDown");
  await rp.keyboard.press("ArrowRight");
  await rp.waitForTimeout(400);
  const after = await rp.evaluate(() => window.scrollY);
  const started = (await rp.getByText("Press an arrow key or swipe to start").count()) === 0;
  if (started && before === after) pass("Snake game starts on the first arrow key, and arrows don't scroll the page");
  else fail(`Snake game (started ${started}, scroll ${before} → ${after})`);
  await reduced.close();
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  const links = await checkRoutes(browser);
  await checkLinks(links);
  await checkInteractions(browser);
  await checkSnake(browser);
  await checkCv(browser);
} finally {
  await browser.close();
}

console.log(failures.length ? `\n${failures.length} problem(s) found.` : "\nAll smoke checks passed.");
process.exit(failures.length ? 1 : 0);

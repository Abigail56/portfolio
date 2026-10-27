# Chukwu Chinecherem — portfolio

The portfolio of **Chukwu Chinecherem**, Full-Stack Software Engineer, built as a small software product:
project case studies, engineering notes with real code, and a working contact form, in a calm, editorial design.
A small Lab (quiz, debugging exercise, memory game, terminal) is linked from the footer.

Built with Next.js (Pages Router), React, TypeScript and Tailwind CSS v4.

## Run it

You need Node.js 20.9 or newer.

```bash
npm install          # .npmrc sets legacy-peer-deps; see "Notes" below
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Checks

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript, strict mode |
| `npm run lint` | ESLint with Next.js, React Hooks and jsx-a11y rules |
| `npm test` | Unit tests (Vitest): terminal, games, contact API, content integrity, colour contrast |
| `npm run check` | All three above |
| `npm run test:e2e` | Browser smoke test against a running build (`npm start` first; `BASE_URL` to point elsewhere). Every route at 360 px and 1440 px in both themes: console errors, horizontal overflow, broken images, links, CV download, 404, plus the menu, theme, Work page, terminal, games and contact form |

The browser scripts use the Chrome installed on the machine (`/usr/bin/google-chrome`; set `CHROME_PATH` to change it).

## Contact form

The form posts to `/api/contact`, which validates the message (the same Zod schema as the form), rate-limits by IP and
sends it with [Resend](https://resend.com). Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Server-side only. Without it the form tells visitors the message was **not** sent and offers the email link |
| `CONTACT_TO_EMAIL` | Where messages go |
| `CONTACT_FROM_EMAIL` | Sender. `onboarding@resend.dev` only delivers to the Resend account owner's own address; verify a domain to send from your own |
| `NEXT_PUBLIC_SITE_URL` | Optional custom domain (no trailing slash). Without it, the free Vercel or Render address is used for canonical links, social previews and the sitemap |

The visitor's address is set as `reply_to`, so pressing Reply answers them. Success is shown only when Resend accepts the email.

## Editing content

Everything visitors read comes from typed files in `src/content` and `src/config`:

| File | Content |
|---|---|
| `src/config/site.ts` | Brand name, role, contact details, links, CV path, the "open to opportunities" switch, navigation |
| `src/content/projects.ts` | Projects and their case studies (status, links, screenshots, architecture, code excerpt) |
| `src/content/engineering.ts` | Engineering topics and code excerpts |
| `src/content/profile.ts` | About text, toolkit, experience timeline |
| `src/content/systemMap.ts` | Layers in the hero's interactive system map |
| `src/content/playground.ts` | Quiz questions, bug challenges, memory pairs |

`npm test` checks the content: slugs, https links, that screenshots and the CV exist, that "live" projects have a live
link, that every project referenced elsewhere exists, and that the JavaScript quiz answers are actually correct.

### Screenshots

`npm run screenshots` captures each project into `public/projects/` (desktop and phone). Live sites are captured from
their URLs; projects that aren't deployed are captured from a local copy (see the variables at the top of
`scripts/capture-screenshots.mjs`). `node scripts/generate-assets.mjs` rebuilds the favicon set and `public/og.png`.

### CV

Replace `public/cv/Chinecherem-Chukwu-CV.pdf` (keep the name, or change `cv` in `src/config/site.ts`).

## Structure

```
src/
  config/site.ts            identity, links, navigation
  content/                  all copy and data (typed)
  lib/                      pure logic: terminal interpreter, game helpers, contact schema, theme, storage
  lib/server/               server-only: email sender, rate limiter
  components/
    layout/                 header, footer, theme toggle, SEO
    ui/                     buttons, badges, sections, code block
    home/ projects/ playground/ contact/
  pages/                    routes (Pages Router) and /api/contact
  styles/globals.css        design tokens (light + dark) and base styles
tests/                      Vitest unit tests
scripts/                    screenshots, asset generation, browser smoke test
```

## Design system

A neutral charcoal/off-white palette with ink-coloured buttons and one muted blue for links. Colours, shadows, radii and motion are tokens in `src/styles/globals.css`, defined once per theme and mapped to
Tailwind names (`bg-surface`, `text-muted`, `border-line`, `text-accent`…). Components use only those names, so both
themes stay consistent. `tests/contrast.test.ts` checks every text token against every background for WCAG AA.
Motion is limited to state changes and is turned off for visitors who prefer reduced motion.

## Notes

- `npm install` needs `legacy-peer-deps` (set in `.npmrc`): npm's peer resolver crashes on Vitest 5's optional peers.
  The npm bundled with Debian/Ubuntu (9.2) also crashes on this tree; use npm 10+ (`npx npm@10 install`) if it does.
- Fonts (Inter for text, JetBrains Mono for code, Figtree for the generated social images; SIL OFL 1.1) are self-hosted in `src/fonts`.

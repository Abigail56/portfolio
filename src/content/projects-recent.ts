import type { Project } from "@/lib/types";

// FleetPulse, EchoVault Nexus and GhostWork. Every statement was checked against each project's README, docs and
// source. None of the three has been deployed, and the repositories say so; keep that visible here.

export const fleetpulse: Project = {
  slug: "fleetpulse",
  name: "FleetPulse",
  discipline: "Multi-tenant fleet management SaaS",
  tagline: "Vehicles, drivers, trips, maintenance and costs in one multi-tenant platform.",
  summary:
    "A multi-tenant fleet management platform: GPS tracking and a live map, trips and dispatch, geofences and alerts, maintenance, fuel and expenses, inspections, reports and billing. Built and tested locally; it has not run in production.",
  category: "full-stack",
  kind: "product",
  status: "not-deployed",
  period: "2026",
  accent: "#6fcfc4",
  monogram: "FP",
  featured: true,
  links: { repo: "https://github.com/Abigail56/fleetpulse" },
  screenshot: {
    desktop: "/projects/fleetpulse.jpg",
    mobile: "/projects/fleetpulse-mobile.jpg",
    alt: "FleetPulse landing page: 'Every Vehicle. Every Journey. Under Control.' beside a live fleet panel labelled as simulated demo data.",
    capturedFrom: "a local production build (signed-out landing page; the fleet panel shows labelled, simulated data and a simplified map)",
    backdrop: "#0d1b1c",
  },
  stack: ["Python 3.13", "FastAPI", "SQLModel", "Alembic", "PostgreSQL 17 + PostGIS", "Redis", "Celery", "S3-compatible storage", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "TanStack Query", "MapLibre", "Pytest", "Vitest", "Playwright", "Docker Compose", "Caddy"],
  coreStack: ["FastAPI", "PostgreSQL + PostGIS", "Redis", "Celery", "Next.js", "MapLibre"],
  features: [
    "Organisations with eight roles, from owner to read-only, and permissions listed explicitly in code",
    "GPS positions checked against geofences, speed and ignition rules, then streamed to a live map over WebSockets",
    "Trips from draft to completion that refuse a vehicle in maintenance, a critical defect, a suspended driver or an expired licence",
    "Maintenance schedules, inspections that can't default to a pass, and document expiry reminders",
    "Fuel and expense records in any currency, with amounts in different currencies never added together",
    "Nine reports with date filters and CSV and PDF exports",
  ],
  contributions: [
    "Sole contributor to the repository: data model, API, background jobs, web app and deployment setup",
    "Recorded 18 architecture decision records, covering tenancy, telemetry, authentication, billing and deployment",
    "Set up CI and the test suites at unit, integration and browser level",
  ],
  caseStudy: {
    problem:
      "An organisation running vehicles has to know where they are, keep them legal and maintained, and control what they cost. When that information is split across tools, nobody has one reliable view of the fleet.",
    motivation:
      "Fleet software is a demanding test of engineering: continuous location data, many organisations sharing one system, and rules that must hold even when the code has a bug.",
    solution:
      "One subscription platform where each organisation sees its vehicles, trips, maintenance, compliance and costs, and where the database itself keeps organisations apart.",
    audience:
      "Logistics and delivery companies, transport businesses and other organisations with vehicles to run: owners, fleet managers, dispatchers, maintenance and finance staff, and drivers, each with their own role.",
    built: [
      "A FastAPI and SQLModel API, with routes, schemas and services kept separate",
      "Celery workers and a scheduler for email, alerts, automation rules and upkeep",
      "A Next.js web app organised into feature modules, with a MapLibre live map",
      "A production setup with Docker Compose, Caddy for HTTPS, and backup and restore scripts",
    ],
    howItWorks: [
      "A GPS device or vendor sends a position with a secret key. It is checked and stored, and in the same transaction FleetPulse checks for geofence crossings, speeding and movement with the ignition off.",
      "Anyone watching the live map gets the update over a WebSocket. If that connection drops, the page says so and refreshes every 30 seconds.",
      "A scheduled job picks up new alerts, notifies the right people, emails them according to their preferences and runs matching automation rules.",
      "When a trip finishes, its distance is measured from GPS positions and labelled as GPS, simulated or typed in.",
    ],
    architecture: {
      caption: "Taken from docs/project-guide.md. The web app holds no business rules; the API checks everything again.",
      layers: [
        { label: "Clients", nodes: [{ label: "Next.js web app", detail: "HTTPS and WebSocket" }, { label: "GPS devices and vendors", detail: "HTTPS with a secret key" }] },
        { label: "Application", nodes: [{ label: "FastAPI", detail: "Sign-in, permissions and all business rules" }, { label: "Celery worker and scheduler", detail: "Email, alerts, automation and upkeep" }] },
        { label: "Data", nodes: [{ label: "PostgreSQL + PostGIS", detail: "Records and location queries" }, { label: "Redis", detail: "Queue, live updates and rate limits" }, { label: "File storage", detail: "Private receipts and documents" }] },
      ],
    },
    decisions: [
      { title: "Tenant isolation enforced twice", detail: "The API takes the organisation from the session, never the request. PostgreSQL row-level security then applies the same rule, so a forgotten filter returns nothing rather than another organisation's rows." },
      { title: "Monthly partitions for telemetry", detail: "Vehicle positions are range-partitioned by month, so old data can be dropped at once instead of through a bulk delete. A resent position conflicts with the primary key rather than creating a duplicate." },
      { title: "A separate database role for the app", detail: "The app connects as a role that isn't a superuser and doesn't own the tables. Migrations use a different account, whose URL the running app never receives." },
      { title: "Never show what can't be backed up", detail: "An unknown speed shows as unknown, not 0. Simulated data is always labelled, and a position turns stale, then offline, as it ages." },
    ],
    challenges: [
      { title: "Links between organisations", detail: "References between tenant tables use composite foreign keys that include the organisation id, so the database rejects a cross-organisation link. A test fails if any table breaks this rule." },
      { title: "Conditions that change after dispatch", detail: "A driver's licence or a vehicle's condition can change between dispatch and departure, so the checks run again at departure." },
      { title: "Keeping the last owner", detail: "An organisation must keep at least one active owner. Role changes lock the organisation row, so two concurrent demotions can't both succeed." },
    ],
    testing: [
      "Recorded final run: 834 backend tests, 336 frontend unit tests and 415 browser tests against the real system in Chromium, phone and Firefox profiles",
      "A local check of the production setup with HTTPS, and a backup restored into a new database",
      "Tests fail if a new table lacks grants or a row-level security policy",
    ],
    statusNote:
      "All planned features are built and tested on one development machine. FleetPulse has never run on a real server, or with real customers, a real GPS device or a real payment.",
    limitations: [
      "No GPS vendor or payment provider is connected. Positions come from a documented feed or a labelled simulator",
      "Paystack billing has only been tested against a stand-in for its server",
    ],
    nextSteps: ["Deploy it to a real server and work through the pre-launch checklist", "Connect a real GPS vendor", "Run a real test-mode payment before turning on billing limits"],
  },
};

export const echovault: Project = {
  slug: "echovault-nexus",
  name: "EchoVault Nexus",
  discipline: "Knowledge workspace with a source-grounded AI assistant",
  tagline: "Notes, projects and decisions in one place, with an AI assistant that shows its sources.",
  summary:
    "A personal knowledge workspace for capturing notes, grouping them into projects, recording decisions with their reasoning and searching everything. An optional AI assistant answers only from your own records and links its sources.",
  category: "full-stack",
  kind: "product",
  status: "not-deployed",
  period: "2026",
  accent: "#8f8cff",
  monogram: "EV",
  featured: true,
  links: { repo: "https://github.com/Abigail56/Echovault" },
  screenshot: {
    desktop: "/projects/echovault.jpg",
    mobile: "/projects/echovault-mobile.jpg",
    alt: "EchoVault Nexus landing page: 'Your knowledge, connected to every decision.' beside a diagram linking a note to a project, a decision and references.",
    capturedFrom: "a local run of the web app (signed-out landing page; the diagram uses labelled sample data)",
    backdrop: "#0b0c14",
  },
  stack: ["Python", "FastAPI", "SQLModel", "SQLAlchemy 2", "Alembic", "PostgreSQL 17", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "DaisyUI 5", "React Hook Form", "Zod", "Pytest", "Vitest", "Playwright", "Docker Compose"],
  coreStack: ["FastAPI", "SQLModel", "PostgreSQL", "Next.js", "TypeScript", "Tailwind CSS"],
  features: [
    "A Markdown knowledge vault with tags, project links, two-way related notes and a connection map",
    "A decision journal: context, alternatives, the option chosen, reasoning, and expected and actual outcomes",
    "PostgreSQL full-text search across notes, tags, projects and decisions, with highlighted excerpts",
    "File attachments with server-side text extraction, including OCR for images and scanned PDFs",
    "An AI assistant that uses Claude or any OpenAI-compatible server, and isn't called when no notes match",
  ],
  contributions: [
    "Sole contributor to the repository: database schema, API, web app, tests and documentation",
    "Designed cookie-based sessions with refresh-token rotation, server-side revocation and CSRF protection",
    "Wrote Pytest, Vitest and Playwright suites, including a browser check of cross-user privacy",
  ],
  caseStudy: {
    problem:
      "Knowledge gets scattered across chats, bookmarks and files. People remember that something was decided but not why, and general AI chatbots answer from the internet rather than from their own records.",
    motivation:
      "Most note tools keep the conclusion and lose the reasoning. Keeping decisions, and the notes behind them, connected makes that reasoning available later.",
    solution:
      "One private workspace connecting notes, projects and decisions, with keyword search and an optional assistant that answers only from the user's records and says plainly when they don't cover a question.",
    audience: "Developers, students, researchers, founders and anyone whose work depends on remembering what they learned and why they decided something.",
    built: [
      "A FastAPI backend with thin routers and business logic in services",
      "A Next.js web app with a typed API client and a responsive design system",
      "An AI provider layer supporting Anthropic and OpenAI-compatible servers such as a local Ollama",
      "A file pipeline that detects each file's real type from its bytes and extracts its text",
    ],
    howItWorks: [
      "The browser only talks to the Next.js origin, which forwards /api/v1 to FastAPI, so session cookies stay first-party.",
      "Each request checks the JWT and that its session hasn't been revoked, so signing out takes effect immediately.",
      "Search uses PostgreSQL full-text indexes with prefix matching, stemming and ranking.",
      "The assistant retrieves the user's most relevant records and sends them with the question. If nothing matches, the provider isn't called.",
    ],
    architecture: {
      caption: "Taken from docs/HOW-IT-WORKS.md. The AI provider is optional, and the page says so when none is configured.",
      layers: [
        { label: "Frontend", nodes: [{ label: "Next.js", detail: "Pages, forms and a proxy for /api/v1" }] },
        { label: "Backend", nodes: [{ label: "FastAPI", detail: "Accounts, sessions, rules, search and the assistant" }] },
        { label: "Services", nodes: [{ label: "PostgreSQL", detail: "All records, with Alembic migrations" }, { label: "Mailpit", detail: "Catches email in development" }, { label: "AI provider", detail: "Optional: Claude or a local Ollama" }] },
      ],
    },
    decisions: [
      { title: "HttpOnly cookies, not localStorage", detail: "A script injected into the page could read tokens from localStorage, but it can't read HttpOnly cookies. A readable CSRF cookie, copied into a header, protects every write." },
      { title: "Keyword search, described as keyword search", detail: "Search is PostgreSQL full-text and the project says so. The database image supports pgvector, but semantic search isn't implemented or claimed." },
      { title: "Other users' records return 404", detail: "Ownership is enforced in every query. Returning 404 rather than 403, with UUID keys, means record ids can't be probed." },
    ],
    challenges: [
      { title: "Prompt injection through notes", detail: "Notes are wrapped as escaped source data, the model is told never to follow instructions inside them, and citations that don't match a retrieved source are ignored. The README is clear that this reduces the risk rather than removing it." },
      { title: "Refresh tokens and theft", detail: "Refresh tokens rotate, and only their hash is stored. Reuse of an old token after a 30-second grace period revokes the session." },
      { title: "Untrusted uploads", detail: "SVG, HTML, macro-enabled Office files and other ZIPs are refused based on their bytes. Files are stored outside any web folder under random names, with limits enforced while streaming." },
    ],
    testing: [
      "Pytest runs against a separate database and refuses to run unless its name ends in _test",
      "Playwright drives a real browser through sign-in, notes, projects, decisions, search and cross-user privacy",
      "An automated test checks 19 pages for horizontal overflow from 320px to 1440px",
    ],
    statusNote: "It runs locally with one command and has no public deployment yet.",
    limitations: [
      "Search is keyword-based; semantic search isn't implemented",
      "Assistant conversations aren't saved, and each question is answered on its own",
      "Rate limiting is held in memory, so it applies per process",
    ],
    nextSteps: ["Deploy it publicly", "Add semantic search using pgvector", "Move rate limiting to a shared store"],
  },
};

export const ghostwork: Project = {
  slug: "ghostwork",
  name: "GhostWork",
  discipline: "Workflow automation platform",
  tagline: "Visual workflow automation, on a canvas that shows what each step did.",
  summary:
    "A workflow automation platform built around the Living Workflow: the same canvas you design an automation on shows what it is doing while it runs and what each step did afterwards. It has a web app and a Flutter mobile app.",
  category: "full-stack",
  kind: "product",
  status: "not-deployed",
  period: "2026",
  accent: "#8b8bff",
  monogram: "GW",
  featured: true,
  links: { repo: "https://github.com/Abigail56/ghostwork" },
  screenshot: {
    desktop: "/projects/ghostwork.jpg",
    mobile: "/projects/ghostwork-mobile.jpg",
    alt: "GhostWork workflow builder: a step library, a canvas of connected trigger, action and condition steps, and a test run listing each step's result and timing.",
    capturedFrom: "the project's design board, rendered from the running app with sample data",
    backdrop: "#080b12",
  },
  stack: ["Python", "FastAPI", "SQLModel", "SQLAlchemy", "Alembic", "PostgreSQL", "Celery", "Redis", "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "React Flow", "TanStack Query", "Flutter", "Riverpod", "Pytest", "Playwright", "Docker Compose"],
  coreStack: ["FastAPI", "Celery", "PostgreSQL", "Redis", "Next.js", "React Flow", "Flutter"],
  features: [
    "A visual builder with undo and redo, per-step validation and live test runs",
    "Manual, scheduled and webhook triggers, with optional HMAC-SHA256 signatures on webhooks",
    "HTTP, transform, condition, email, Slack, GitHub and Google Sheets steps",
    "Per-step run records with status, attempts, output, errors and timing, plus cancellation and re-runs",
    "A Flutter app for Android, iOS and web that talks to the same API",
  ],
  contributions: [
    "Sole contributor to the repository: API, execution engine, web app, mobile app and CI",
    "Built the execution engine on Celery, with time limits, a stale-run reaper and per-user concurrency limits",
    "Wrote 73 backend tests, 17 Playwright tests and 28 Flutter tests",
  ],
  caseStudy: {
    problem:
      "Repetitive work between tools is a good candidate for automation, but when an automation fails it can be hard to see which step failed and why.",
    motivation:
      "A builder and its run history are often separate screens. Showing each run on the canvas where the workflow was built puts a failure in the place it can be fixed.",
    solution:
      "A no-code workflow canvas that doubles as the monitor: steps light up as they run, and each one keeps its own record of status, output, error and timing.",
    audience: "People who want repetitive work between web services automated without writing code, and who need to see what happened when a run fails.",
    built: [
      "A FastAPI backend that is the single source of business rules",
      "An execution engine on Celery workers, with a scheduler for due workflows and clean-up",
      "A Next.js app with a React Flow canvas, builder and execution history",
      "A Flutter app with the same features, and browser and mobile push notification support",
    ],
    howItWorks: [
      "A workflow is saved as a definition of steps and connections. Activating or running it requires full validation: one trigger, a reachable graph, required settings and references that resolve.",
      "A manual click, a schedule or a webhook call queues a run, and a Celery worker takes it from Redis, so a slow step never holds up the API.",
      "The worker writes each step's result to PostgreSQL, which is what the web and mobile apps read back.",
      "Runs execute a snapshot of the definition, so editing a workflow never changes past history.",
    ],
    architecture: {
      caption: "Taken from the README and the project's walkthrough. Every rule and ownership check is enforced in the API.",
      layers: [
        { label: "Clients", nodes: [{ label: "Next.js web app", detail: "Canvas, builder and history" }, { label: "Flutter mobile app", detail: "Android, iOS and web" }] },
        { label: "Application", nodes: [{ label: "FastAPI", detail: "The single source of truth" }, { label: "Celery worker", detail: "Runs the workflows" }, { label: "Celery beat", detail: "Schedules, stuck-run clean-up and retention" }] },
        { label: "Data", nodes: [{ label: "PostgreSQL", detail: "Users, workflows, runs, steps and encrypted integrations" }, { label: "Redis", detail: "Queue and rate limits" }] },
      ],
    },
    decisions: [
      { title: "Run a snapshot, not the live definition", detail: "A run executes the definition as it was when it started, so its history stays accurate after later edits." },
      { title: "Access tokens in memory, refresh in a cookie", detail: "A 15-minute JWT stays in memory and a rotating refresh token sits in an HttpOnly cookie. Each request checks its session is active, so revocation is immediate." },
      { title: "Label what isn't built", detail: "Team workspaces, billing and OAuth sign-in appear as Planned in the interface rather than as controls that do nothing." },
    ],
    challenges: [
      { title: "Requests to user-supplied URLs", detail: "An HTTP step can call any address its author types, so requests pass through a network guard against server-side request forgery, with retries and timeouts." },
      { title: "Storing third-party credentials", detail: "SMTP, Slack and HTTP credentials are encrypted with Fernet and never returned by the API." },
      { title: "Runs that get stuck", detail: "Time limits and a reaper that runs every two minutes clean up stuck runs, and each user has a concurrency limit." },
    ],
    testing: [
      "73 backend tests against a real PostgreSQL test database, with migration checks in CI",
      "17 Playwright tests at desktop and mobile widths; 28 Flutter tests",
      "Browser push was delivered for real through Google's push service in Chrome",
    ],
    statusNote: "It runs locally and has no public deployment. It has not been hardened or load-tested for production use.",
    limitations: [
      "GitHub and Google Sheets steps are tested only against mocked HTTP responses",
      "Android and iOS push has never run on a device",
      "Team workspaces, billing and OAuth sign-in are not implemented",
    ],
    nextSteps: ["Work through the production checklist and deploy it", "Test GitHub and Google Sheets with real credentials", "Run mobile push on a real device"],
  },
};

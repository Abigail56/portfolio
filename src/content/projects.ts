import type { Project, ProjectCategory, ProjectStatus } from "@/lib/types";

// Every statement below was checked against the project's repository (README, source and config).
// Before adding a claim, check it against the code. Before marking a project "live", check that the URL responds.

export const projects: Project[] = [
  {
    slug: "routebridge",
    name: "RouteBridge Logistics",
    tagline: "Last-mile delivery operations for Nigerian delivery companies.",
    summary:
      "A multi-tenant platform where delivery companies take orders from their merchants, dispatch them to drivers, track every delivery live, collect cash on delivery and reconcile it at the end of the day.",
    category: "full-stack",
    kind: "product",
    status: "live",
    period: "2026",
    accent: "#2f6bff",
    monogram: "RB",
    featured: true,
    links: {
      live: "https://routebridge-web.onrender.com/",
      repo: "https://github.com/Abigail56/Route-Bridge",
    },
    screenshot: {
      desktop: "/projects/routebridge.jpg",
      mobile: "/projects/routebridge-mobile.jpg",
      alt: "RouteBridge landing page: 'Every order in one place. Every delivery proven.' over a photo of a rider handing a parcel to a shop owner.",
      capturedFrom: "routebridge-web.onrender.com",
    },
    stack: [
      "Python",
      "FastAPI",
      "SQLModel",
      "PostgreSQL + PostGIS",
      "Redis",
      "MinIO",
      "Next.js 14",
      "React",
      "TypeScript",
      "Leaflet",
      "Pytest",
      "Vitest",
      "Playwright",
      "Docker Compose",
    ],
    coreStack: ["Python", "FastAPI", "SQLModel", "PostgreSQL + PostGIS", "Redis", "MinIO"],
    highlights: [
      {
        title: "One rulebook for delivery status",
        detail: "A single transition table decides every status change, for the online API and for events synced from a driver's phone.",
      },
      {
        title: "Nearest-driver search with PostGIS",
        detail: "Indexed ST_DWithin queries on generated geography columns, with a haversine fallback when PostGIS isn't installed.",
      },
      {
        title: "Safe to retry",
        detail: "Idempotency keys on order creation and client-generated event ids, so a flaky connection can't create duplicates.",
      },
      {
        title: "Cash that reconciles",
        detail: "Payments are stored apart from proof of delivery; any difference opens a reconciliation item instead of being corrected silently.",
      },
    ],
    features: [
      "Separate workspaces for each delivery company, with roles for owners, dispatchers, finance, merchants and drivers",
      "Orders become delivery jobs that move through an explicit state machine, from pending to delivered, failed, returned or cancelled",
      "Offline-first driver app (a PWA) that queues actions in an encrypted local store and syncs them in order",
      "Live map for dispatchers and a tracking link for customers, updated through server-sent events over Redis",
      "Cash-on-delivery reconciliation that flags any difference between collected and expected amounts",
      "Its own sign-in: Argon2id password hashes, Continue with Google (OAuth with PKCE), password reset and httpOnly session cookies",
      "Optional automatic assignment of new orders to the nearest available driver",
    ],
    contributions: [
      "Sole contributor to the repository: product specification, data model, API, workers, web console and driver app",
      "Wrote architecture decision records (ADRs) for the riskiest parts: the backend-first approach, delivery state and cash on delivery, offline sync",
      "Wrote the backend test suite (44 Pytest modules plus a PostgreSQL/PostGIS integration test), 18 Vitest files for the web app's logic and a Playwright test for the driver app",
      "Packaged the whole system (database, cache, file storage, API, three workers, web app) for a single docker compose command",
    ],
    caseStudy: {
      problem:
        "A delivery company has to know where every parcel is, prove that it reached the right person, and account for the cash its riders collect on delivery. RouteBridge puts orders, riders, proof of delivery and cash reconciliation in one system, and keeps working when a rider's connection doesn't.",
      audience:
        "Delivery companies in Nigeria and everyone around them: owners and dispatchers who run operations, finance staff who reconcile cash, the shops (merchants) whose orders are delivered, the riders, and the customers waiting for a parcel.",
      built: [
        "A FastAPI and SQLModel API organised by domain: orders, operations, planning, settlements, the merchant portal, the platform console and webhooks",
        "Background workers for the transactional outbox, notifications and maintenance",
        "A Next.js operations console: dispatch board, live map, orders, drivers, merchants, reconciliation, reports and settings",
        "An installable driver app that works offline, and a public tracking page for customers",
        "A platform console where RouteBridge staff manage workspaces without seeing a company's orders or customers",
      ],
      howItWorks: [
        "Every order becomes a delivery job with a stop. Status changes go through one transition table, so the online API and the offline sync follow the same rules.",
        "Changes are written to an append-only audit log and a transactional outbox. A worker publishes them to Redis, which feeds the live map, the customer tracking page and notifications.",
        "The driver app gives every action a client-generated event id and stores it in an encrypted queue. When the phone is online again, events are sent in order; a retried event is recognised as a duplicate, not applied twice.",
        "When a rider records a payment, the system compares the collected amount with the expected amount. A match is closed; any difference opens a reconciliation item for finance to review.",
      ],
      decisions: [
        {
          title: "Start as a modular monolith, backend first",
          detail:
            "The riskiest behaviour is correctness, not visuals: tenant scope, state transitions, offline sync and cash records. I defined those API contracts first, in one deployable service with clear domain boundaries, instead of starting with microservices.",
        },
        {
          title: "Idempotency everywhere a network can fail",
          detail:
            "Order creation accepts an Idempotency-Key header, and driver events carry their own ids. A flaky connection that resends a request can't create a second order or record a delivery twice.",
        },
        {
          title: "Proof of delivery is not proof of payment",
          detail:
            "Payments are a separate record from proof of delivery. Variance is calculated as collected minus expected and flagged; the system never quietly changes the expected amount.",
        },
        {
          title: "Refuse to start with unsafe settings",
          detail:
            "In production the API checks its configuration at startup (secrets present, authentication on, and similar) and lists every problem at once, so a bad deployment fails immediately instead of running insecurely.",
        },
      ],
      challenges: [
        {
          title: "Riders lose connection mid-delivery",
          detail:
            "Solved with the offline queue and ordered, idempotent sync. Rejected events stay on the device for correction instead of being dropped silently.",
        },
        {
          title: "Keeping companies and shops apart",
          detail:
            "Every operations route is scoped to a workspace and checked against the member's role. A merchant user is linked to a single shop: portal routes are restricted to that shop and the general routes refuse the merchant role.",
        },
        {
          title: "Session cookies across a split website and API",
          detail:
            "The httpOnly session cookie has to belong to the website's own domain. When the website and API run on different hosts, the website forwards /api to the API so sign-in still works.",
        },
        {
          title: "Showing location without oversharing it",
          detail:
            "A customer sees the rider's position and an arrival estimate only while their own parcel is on the way and the position is fresh.",
        },
      ],
      testing: [
        "44 Pytest modules for the backend, covering access control, orders, delivery codes, reconciliation, live events, webhook replay, tracking and the production guards. They run on SQLite by default.",
        "A separate integration test runs against real PostgreSQL with PostGIS, for the queries SQLite can't check.",
        "18 Vitest files for the web app's logic: roles, job states, driver navigation, push and session limits.",
        "A Playwright test drives the driver app end to end in a real browser.",
        "In production the API checks its own configuration at startup and refuses to run with unsafe settings.",
      ],
      statusNote:
        "Deployed: the live demo at routebridge-web.onrender.com responds. The SMS, WhatsApp and geocoding integrations are so far tested only against mocked providers, and it has no real customers yet.",
      lessons: [
        "Model the domain before the interface. Defining the delivery states and their permitted transitions first gave the API, the offline driver app and the test suite a single source of truth, so the rules could not drift apart.",
        "Design for unreliable networks from the start. Mobile connections retry requests, so idempotency keys and client-generated event IDs had to be part of the first version rather than a later fix.",
        "Keep financial records separate from operational events. Recording payment independently of proof of delivery made cash reconciliation auditable and kept every discrepancy visible instead of quietly corrected.",
        "Fail fast on unsafe configuration. A production startup check that reports every missing secret or disabled safeguard at once is cheaper than discovering the problem in a running system.",
        "Record decisions while they are being made. Architecture decision records for the backend-first approach, cash on delivery and offline sync made the trade-offs explicit and easier to revisit.",
      ],
      nextSteps: [
        "Test the SMS, WhatsApp and geocoding integrations against real provider accounts; today they are tested against mocked transports only",
        "Get legal review of the privacy documents (Nigeria's NDPA) before real customers use it",
        "Switch to a paid map tile provider for production traffic",
        "Consider a native Android driver app if the PWA's background limits become a problem",
      ],
      architecture: {
        caption: "How a request moves through RouteBridge",
        layers: [
          {
            label: "Clients",
            nodes: [
              { label: "Operations console", detail: "Next.js 14, React" },
              { label: "Driver PWA", detail: "Encrypted offline queue" },
              { label: "Tracking page", detail: "Public, per parcel" },
            ],
          },
          {
            label: "API",
            nodes: [
              { label: "FastAPI", detail: "REST + server-sent events" },
              { label: "Auth & access", detail: "Session cookie, workspace roles" },
              { label: "Safe retries", detail: "Idempotency keys, event ids" },
            ],
          },
          {
            label: "Domain",
            nodes: [
              { label: "Orders → jobs → stops", detail: "Transition table" },
              { label: "Cash on delivery", detail: "Reconciliation items" },
              { label: "Outbox workers", detail: "Notifications, maintenance" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { label: "PostgreSQL + PostGIS", detail: "SQLModel, migrations" },
              { label: "Redis", detail: "Live events, rate limits" },
              { label: "MinIO / S3", detail: "Proof-of-delivery photos" },
            ],
          },
        ],
      },
      snippet: {
        title: "One transition table for every delivery status change",
        language: "python",
        source: "backend/apps/api/src/routebridge/routes/operations.py",
        code: `ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "pending": {"assigned", "cancelled"},
    "assigned": {"accepted", "cancelled"},
    "accepted": {"en_route", "cancelled"},
    "en_route": {"arrived", "cancelled"},
    "arrived": {"delivered", "failed_attempt", "cancelled"},
    "failed_attempt": {"rescheduled", "returned", "cancelled"},
    "rescheduled": {"assigned", "cancelled"},
}

# ...inside the transition endpoint
job = get_job(session, tenant_id, job_id)
target = payload.target_status
if target not in ALLOWED_TRANSITIONS.get(job.status, set()):
    raise HTTPException(status_code=409, detail=f"Invalid transition: {job.status} -> {target}")`,
        note: "The driver-sync endpoint imports the same table, so an event replayed from a driver's phone can't make a transition that the online API would refuse.",
      },
      flows: [
        {
          title: "Delivery job lifecycle",
          caption: "Taken from ALLOWED_TRANSITIONS in routes/operations.py. Any other move is refused with 409 Conflict.",
          steps: ["pending", "assigned", "accepted", "en_route", "arrived", "delivered"],
          branches: [
            { from: "arrived", to: ["failed_attempt"] },
            { from: "failed_attempt", to: ["rescheduled", "returned"] },
            { from: "rescheduled", to: ["assigned"] },
          ],
          note: "Every state before delivered can also move to cancelled.",
        },
      ],
      engineering: [
        {
          title: "Data model",
          detail:
            "About forty SQLModel tables, migrated with Alembic. Operational tables carry a tenant_id, so every query starts from the delivery company it belongs to.",
          points: [
            "Order → DeliveryJob → Stop separates what the merchant asked for from the work a driver does",
            "DeliveryAttempt, ProofOfDelivery and PaymentRecord are separate tables, so a failed attempt or a short payment is a record, not an overwrite",
            "Money is stored as Decimal (14 digits, 2 decimal places), never as a float",
            "AuditEvent and OutboxEvent are append-only; IdempotencyRecord stores a request hash and the original response",
          ],
        },
        {
          title: "API design",
          detail:
            "REST under /api/v1, organised by domain. Tenant routes live under /tenants/{tenant_id}/… and each router declares the roles it accepts as a FastAPI dependency.",
          points: [
            "Merchants use their own /portal routes, limited to their shop; the general operations routes refuse the merchant role",
            "Customers track a parcel through /public/tracking with a per-parcel token, without an account",
            "Request bodies are Pydantic models; many forbid unknown fields, so a typo in a field name is a 422, not a silently ignored value",
          ],
        },
        {
          title: "Geospatial queries",
          detail:
            "A migration adds a generated geography(Point, 4326) column, built from latitude and longitude, plus GiST indexes on drivers and stops. The application keeps writing plain coordinates.",
          points: [
            "GET /drivers/nearby returns available drivers within a radius, nearest first, using ST_DWithin and ST_Distance",
            "Auto-assign gives a waiting job to the nearest available driver, or the one idle longest when there is no position",
            "Without PostGIS (local SQLite, plain PostgreSQL) the same function falls back to a haversine distance in Python; production can be set to refuse to start without it",
          ],
        },
        {
          title: "Live events, caching and files",
          detail: "Redis carries live events and rate limits; S3-compatible storage (MinIO locally) holds delivery photos and signatures.",
          points: [
            "The outbox worker appends events to a per-workspace Redis Stream. The live map reads them over server-sent events and resumes from Last-Event-ID after a reconnect",
            "Without Redis, the stream endpoint falls back to polling the outbox table, so it still works in tests and local runs",
            "Photos are uploaded directly to storage with short-lived presigned URLs (AWS Signature V4); the API never proxies image bytes",
            "Uploads are limited to JPEG, PNG or WebP under 5 MB, and object keys are validated against path traversal",
          ],
        },
        {
          title: "Validation and error handling",
          detail: "Errors say exactly what went wrong, with a status code a client can act on.",
          points: [
            "409 for an invalid state transition, or for an idempotency key reused with a different request body",
            "403 when a role isn't allowed, 404 when a record belongs to another workspace (so its existence isn't revealed)",
            "422 for malformed input, 429 when sign-in and other sensitive routes are rate-limited",
            "Driver events rejected during sync stay on the device for correction instead of being dropped",
          ],
        },
      ],
      limitations: [
        "SMS, WhatsApp and geocoding are tested only against mocked providers, not real accounts.",
        "It has no real customers yet, so it hasn't been tested under real traffic.",
        "The privacy documents haven't had a legal review for Nigeria's NDPA.",
        "The live demo runs on Render's free tier, so the first request after a quiet period can take a while to wake the service.",
      ],
    },
  },
  {
    slug: "voxplay",
    name: "VoxPlay",
    tagline: "Voice-powered party games, played from your own phone.",
    summary:
      "A social gaming platform of real-time multiplayer games: a team quiz (Brain Clash), a humming game, a story duel, a word game and Who's Talking?, a voice game where an AI works out who is speaking.",
    category: "full-stack",
    kind: "product",
    status: "not-deployed",
    period: "2026",
    accent: "#9b5cff",
    monogram: "VX",
    featured: true,
    links: { repo: "https://github.com/Abigail56/voxplay" },
    screenshot: {
      desktop: "/projects/voxplay.jpg",
      mobile: "/projects/voxplay-mobile.jpg",
      alt: "VoxPlay landing page: 'Enter your next universe.' with anime-style artwork of two players wearing headphones.",
      capturedFrom: "a local Docker Compose run",
      backdrop: "#140f2e",
    },
    stack: [
      "Python",
      "FastAPI",
      "WebSockets",
      "SQLModel",
      "PostgreSQL + pgvector",
      "Redis",
      "SpeechBrain ECAPA-TDNN",
      "faster-whisper",
      "FFmpeg",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Zustand",
      "Docker",
    ],
    coreStack: ["FastAPI", "WebSockets", "SQLModel", "PostgreSQL + pgvector", "Redis", "Next.js"],
    highlights: [
      {
        title: "Server-authoritative rooms",
        detail: "Questions, the clock and scores live on the server; answers for an old round, out of turn or after time are refused.",
      },
      {
        title: "Change notices over WebSockets",
        detail: "Redis pub/sub tells every API instance a room changed; the socket says what changed and the browser fetches the new state.",
      },
      {
        title: "Voice as an input",
        detail: "ECAPA-TDNN voiceprints stored in pgvector identify speakers; Whisper transcribes spoken answers and checks liveness.",
      },
    ],
    planned: ["Accent Roulette, a sixth game, is marked “Coming soon” in the app and isn't built yet."],
    modules: {
      label: "Games",
      items: [
        { name: "Brain Clash", detail: "Two-team quiz" },
        { name: "Who's Talking?", detail: "AI voice game" },
        { name: "Beat Drop", detail: "Humming game" },
        { name: "Story Forge", detail: "Story duel" },
        { name: "Word Bomb", detail: "Word game" },
        { name: "Accent Roulette", detail: "Planned", planned: true },
      ],
    },
    features: [
      "Brain Clash: a two-team quiz with four modes, steals, streaks and a tie-breaker, played over room codes and invite links",
      "Beat Drop, Story Forge and Word Bomb run on the same room system: lobby, teams, reconnects and live updates",
      "Who's Talking?: players enrol their voice once; a speaker-recognition model scores impressions, disguises and guessing rounds",
      "Answers can be typed or spoken; speech is transcribed on the server by Whisper and the recording is discarded",
      "A party screen for a TV or laptop with a join QR code, live scores and reveals, opened with a host-only key",
      "A question bank of 218 questions across 16 categories, with a test that checks every answer against the answer checker",
    ],
    contributions: [
      "Sole contributor to the repository: game design, backend, real-time layer, voice pipeline and frontend",
      "Designed the server-authoritative game model so that scores, clocks and answers can't be manipulated from the browser",
      "Wrote the Pytest suite: API, audio handling, liveness checks, voice matching, Brain Clash and the game modes",
      "Tested the voice game end to end with three separate browsers using synthetic voices on fake microphones",
    ],
    caseStudy: {
      problem:
        "Group games at a party or in a group chat usually need one shared screen or everyone in the same room. VoxPlay lets each person play from their own phone, using their voice, with the server keeping the game fair.",
      audience:
        "Friends, families, classes and group chats, with question content (music, football, Nollywood, Pidgin, current affairs) written for Nigerian and African players.",
      built: [
        "A FastAPI backend serving REST endpoints and a WebSocket for live room updates",
        "Room, turn and scoring logic for five games, all held in Redis",
        "A voice pipeline: FFmpeg normalisation, ECAPA-TDNN voiceprints stored in pgvector, and Whisper transcription for liveness and spoken answers",
        "A Next.js frontend with its own design system, illustrated characters, sound effects and a TV-friendly party screen",
        "Player accounts with salted scrypt password hashes and JWTs; guests can join with just a name",
      ],
      howItWorks: [
        "A room is a JSON document in Redis. Every change happens under a Redis lock, so two phones can't take the same turn or score the same question.",
        "Each change is published on Redis pub/sub. A WebSocket tells each browser what changed, and the browser fetches the new state over HTTP, so several API instances can share the same rooms.",
        "For a voice turn, the clip is converted to 16 kHz mono and trimmed of silence. The model turns it into a 192-number voiceprint, which is compared with enrolled players by cosine similarity.",
        "To stop replayed recordings, every turn uses a fresh phrase that is valid for two minutes and can be used once, and Whisper checks that it was actually spoken.",
      ],
      decisions: [
        {
          title: "The server owns the game",
          detail:
            "Questions, answers, the clock and the score live on the server. The browser only sends what the player said; answers for an old round, after time runs out or out of turn are refused.",
        },
        {
          title: "Slow work outside the lock",
          detail:
            "Running the voice model takes about two seconds, so it runs without holding the room lock. Points are then booked under the lock, but only if the game hasn't moved on in the meantime.",
        },
        {
          title: "Flag possible cheating, never punish automatically",
          detail:
            "Signs such as leaving the tab or pasting an answer each carry a weight and are combined as independent probabilities. One sign alone is never enough. A flagged answer's points are held, and the host decides.",
        },
        {
          title: "Privacy by default",
          detail:
            "Raw recordings aren't stored; humming clips expire from Redis within ten minutes; a shared location is pinned to the neighbourhood, not the exact point.",
        },
      ],
      challenges: [
        {
          title: "Forgiving but fair answer checking",
          detail:
            "The checker ignores case, accents, punctuation and filler words, turns spoken numbers into digits and allows small typos in longer words, but rejects hedged answers like 'Ghana or Nigeria'.",
        },
        {
          title: "Reconnecting players",
          detail:
            "A player who reloads or loses connection lands back in the same room with their team and points, because the room state lives on the server, not in the tab.",
        },
      ],
      testing: [
        "10 Pytest modules: the API, audio handling, liveness checks, voice matching, Brain Clash, the game modes and the demo flow.",
        "A test runs every question in the bank through the answer checker, so a question whose own answer would be marked wrong fails the suite.",
        "The voice game was tested end to end with three separate browsers, using synthetic voices on fake microphones; the output is kept in the repository (docs/e2e-demo-output.txt).",
        "Room changes happen under a Redis lock, and answers for an old round, out of turn or after time runs out are refused by the server.",
      ],
      statusNote:
        "Not currently deployed. The repository includes Render and Hugging Face Space configurations, but no hosted instance is running. It runs locally with Docker Compose, which is where the screenshots come from.",
      lessons: [
        "Make the server the authority in multiplayer systems. Keeping questions, timing and scoring on the server is what keeps a game played across many personal devices fair and resistant to tampering.",
        "Keep slow work out of critical sections. Running voice inference outside the room lock, then re-validating the game state before awarding points, kept rooms responsive without compromising correctness.",
        "Treat automated signals as evidence, not verdicts. The fair-play system flags suspicious answers and leaves the final decision to the host, so no player is penalised on a single false positive.",
        "Build privacy into the design rather than adding it later. Discarding raw recordings and expiring audio clips limits the sensitive data the system holds at any time.",
        "Test content with the same rigour as code. Running every question through the answer checker means an incorrectly keyed question fails the test suite instead of reaching players.",
      ],
      nextSteps: [
        "Bring a hosted instance back online. The repository includes Render and Hugging Face Space deployment configs, but no hosted instance is running at the moment",
        "Move the heavy voice models to a separate worker so game traffic and model inference can scale independently",
      ],
      architecture: {
        caption: "One room, many phones",
        layers: [
          {
            label: "Clients",
            nodes: [
              { label: "Player phones", detail: "Next.js, mic via MediaRecorder" },
              { label: "Party screen", detail: "Host-only key, read-only view" },
            ],
          },
          {
            label: "API",
            nodes: [
              { label: "FastAPI REST", detail: "Turns, answers, accounts (JWT)" },
              { label: "WebSocket /ws", detail: "Says what changed" },
            ],
          },
          {
            label: "Game & voice",
            nodes: [
              { label: "Game engine", detail: "Rounds, scoring, fair-play flags" },
              { label: "Voice pipeline", detail: "FFmpeg → ECAPA-TDNN, Whisper" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { label: "Redis", detail: "Rooms, locks, pub/sub, one-time phrases" },
              { label: "PostgreSQL + pgvector", detail: "Players, results, voiceprints" },
            ],
          },
        ],
      },
      snippet: {
        title: "Combining fair-play signals",
        language: "python",
        source: "backend/app/fairplay.py",
        code: `class Sign(BaseModel):
    reason: str
    weight: float


def suspicion(signs: list[Sign]) -> float:
    clean = 1.0
    for s in signs:
        clean *= 1 - s.weight
    return round(1 - clean, 2)`,
        note: "Each sign is treated as independent evidence: suspicion = 1 − Π(1 − w). The weights are tuned so that one sign alone stays below the flag threshold and any two signs reach it.",
      },
      flows: [
        {
          title: "One change, every phone",
          caption: "How a player's action reaches everyone else in the room (backend/app/rooms.py, routers/game.py).",
          steps: ["HTTP request", "Redis lock", "Room JSON updated", "Redis pub/sub", "WebSocket notice", "Browser refetches"],
          note: "The socket only says what changed ({\"type\": \"room\"}); the state itself always comes from one HTTP endpoint, so a missed message is repaired by the next fetch.",
        },
        {
          title: "Room lifecycle",
          caption: "Room status and turn phases in the voice game (Status and Phase in backend/app/rooms.py).",
          steps: ["lobby", "playing", "finished"],
          branches: [{ from: "playing", to: ["speak → vote (Guess Who)", "speak → rate (humans vs AI)"] }],
          note: "A room expires from Redis a set number of hours after its last change.",
        },
      ],
      engineering: [
        {
          title: "Real-time communication",
          detail: "One WebSocket endpoint, /ws, carries live updates for the dashboard, a voice room and a Brain Clash room.",
          points: [
            "Browsers can't send headers on a WebSocket, so the JWT goes in ?token=; a bad token closes the socket with code 4401 (“sign in again”)",
            "The browser pings every 15 seconds, which keeps the player marked online",
            "A party screen connects with a host-only screen key instead of a token: it hears one room and isn't counted as a player",
          ],
        },
        {
          title: "Game state and concurrency",
          detail: "Rooms are JSON documents in Redis, so any API instance can serve any room.",
          points: [
            "Every change runs inside a Redis lock on the room, so two phones can't take the same turn or score the same question twice",
            "Beat Drop, Story Forge and Word Bomb are modes of the Brain Clash room engine, sharing its lobby, teams, timers and scoring",
            "Slow voice inference runs outside the lock; points are booked under the lock only if the round hasn't moved on",
          ],
        },
        {
          title: "Sessions and reconnection",
          detail: "Player identity comes from the account or guest token, not the browser tab.",
          points: [
            "Joining a room you're already in brings back your team and points, so a reload or dropped connection doesn't lose your place",
            "Accounts use salted scrypt password hashes and JWTs; guests can join with just a name",
          ],
        },
        {
          title: "Persistence and vectors",
          detail: "PostgreSQL holds players, results and voiceprints; Redis holds what only matters during a game.",
          points: [
            "Each enrolled voice is a 192-number ECAPA-TDNN embedding in a pgvector column, compared by cosine similarity",
            "One-time phrases for voice turns, humming clips and replay clips live in Redis with short expiry times",
          ],
        },
      ],
      limitations: [
        "Not deployed: there is no hosted instance, so it can only be tried by running it locally with Docker Compose.",
        "The voice models run inside the API process, so model inference and game traffic can't be scaled separately yet.",
        "Accent Roulette is designed but not built.",
      ],
    },
  },
  {
    slug: "votingui-nextjs",
    name: "VotingUI · Next.js",
    tagline: "A small voting app whose rules are enforced on the server.",
    summary:
      "A single-precinct voting app for a fixed roll of 20 registered voters: one ballot each, enforced by a Next.js API route, with a live tally board and a winner banner when every ballot is in.",
    category: "full-stack",
    kind: "learning",
    status: "live",
    period: "Aug 2026",
    accent: "#e8742a",
    monogram: "VN",
    featured: false,
    links: {
      live: "https://voting-ui-next-js.vercel.app/",
      repo: "https://github.com/Abigail56/VotingUI-NEXT.JS",
    },
    screenshot: {
      desktop: "/projects/votingui-nextjs.jpg",
      mobile: "/projects/votingui-nextjs-mobile.jpg",
      alt: "VotingUI Next.js: a ballot counter showing 1 of 20 votes cast, the election result card and the tally board.",
      capturedFrom: "voting-ui-next-js.vercel.app",
    },
    stack: ["Next.js (Pages Router)", "React", "TypeScript", "TanStack Query", "Tailwind CSS", "React Icons"],
    features: [
      "API route with GET, POST and DELETE on /api/votes and precise status codes: 400, 403, 405 and 409",
      "Server-side rules: the voter must be on the roll, can vote once, and voting closes after 20 ballots",
      "Tally that groups write-in candidates regardless of case and spacing, sorted by votes, then alphabetically",
      "A typed API client that turns error responses into an ApiError carrying the HTTP status",
      "Ballot counter, tally board with a leader indicator, and a winner banner",
    ],
    contributions: [
      "Built on my own, the day after VotingUI DOM, with the voting rules moved from the browser to the server",
    ],
    caseStudy: {
      problem:
        "VotingUI DOM kept every rule in the browser, so anyone could clear their storage and vote again. In this version the server decides whether a ballot is valid.",
      audience: "A small group, such as a class or a hackathon team, running a quick vote among a known list of people.",
      built: [
        "A Next.js API route that validates and stores ballots",
        "A castVote function that returns a typed result instead of throwing, so the route can map each failure to the right status code",
        "A React Query front end that refreshes the tally after each ballot",
      ],
      howItWorks: [
        "The page loads the current ballots with React Query. Submitting a vote POSTs the voter and candidate to /api/votes.",
        "The route checks the request body, then castVote applies the rules in order: fields present, voter on the roll, ballot box not full, voter hasn't voted.",
        "Valid ballots are written to a JSON file and the route responds with the updated count and remaining ballots.",
      ],
      decisions: [
        {
          title: "Return results, don't throw",
          detail:
            "castVote returns { ok: true, votes } or { ok: false, status, error }. The route stays a simple switch, and TypeScript makes sure every failure carries a status.",
        },
        {
          title: "Status codes that mean something",
          detail:
            "400 for bad input, 403 once voting is closed, 409 for a second vote from the same person, 405 with an Allow header for unsupported methods.",
        },
      ],
      challenges: [
        {
          title: "Case-insensitive write-ins",
          detail:
            "Candidates are typed in by voters, so 'James' and ' james ' must count as one. The tally groups votes by a trimmed, lower-cased key and keeps the first spelling for display.",
        },
      ],
      nextSteps: [
        "Store ballots in a database: a JSON file on a serverless host isn't durable storage",
        "Protect the reset endpoint (DELETE /api/votes) so that only an administrator can empty the ballot box",
        "Remove the unused addVoter and fetchVoters client functions, which call an endpoint that doesn't exist",
      ],
      architecture: {
        caption: "Request flow",
        layers: [
          { label: "Browser", nodes: [{ label: "React + TanStack Query", detail: "Ballot form, tally board" }] },
          { label: "API route", nodes: [{ label: "/api/votes", detail: "GET · POST · DELETE" }] },
          { label: "Rules", nodes: [{ label: "castVote()", detail: "Roll, one vote, 20-ballot cap" }] },
          { label: "Storage", nodes: [{ label: "data/votes.json", detail: "File on the server" }] },
        ],
      },
      snippet: {
        title: "The voting rules, on the server",
        language: "typescript",
        source: "src/lib/vote.ts",
        code: `export type VoteResult =
  | { ok: true; votes: Vote[] }
  | { ok: false; status: number; error: string };

export function castVote(voterRaw: string, candidateRaw: string): VoteResult {
  const voter = voterRaw.trim();
  const candidate = candidateRaw.trim();

  if (!voter || !candidate) {
    return { ok: false, status: 400, error: 'Select a voter and enter a candidate name.' };
  }
  if (!isVoterName(voter)) {
    return { ok: false, status: 400, error: 'That name is not on the electoral roll.' };
  }

  const votes = readVotes();

  if (votes.length >= MAX_VOTES) {
    return { ok: false, status: 403, error: 'Voting is closed — all 20 ballots have been cast.' };
  }
  if (votes.some((v) => v.voter === voter)) {
    return { ok: false, status: 409, error: \`\${voter} has already voted.\` };
  }

  const updated = [...votes, { voter, candidate, castAt: new Date().toISOString() }];
  writeVotes(updated);
  return { ok: true, votes: updated };
}`,
      },
    },
  },
  {
    slug: "iotc-landing-page",
    name: "IOTC Landing Page",
    tagline: "A responsive landing page for an online-learning platform, with validated sign-in forms.",
    summary:
      "A multi-section landing page for TOTC, an online-learning platform, built from reusable section components, plus login and registration pages with schema-based form validation.",
    category: "frontend",
    kind: "learning",
    status: "live",
    period: "Aug 2026",
    accent: "#2fb8b0",
    monogram: "IO",
    featured: false,
    links: { live: "https://iotc-landing-page.vercel.app/" },
    repoNote: "The repository is private.",
    screenshot: {
      desktop: "/projects/iotc-landing-page.jpg",
      mobile: "/projects/iotc-landing-page-mobile.jpg",
      alt: "IOTC landing page hero: 'Studying Online is now much easier' beside a photo of a student with floating notification cards.",
      capturedFrom: "iotc-landing-page.vercel.app",
    },
    stack: ["Next.js (Pages Router)", "React", "TypeScript", "Tailwind CSS", "DaisyUI", "Zod", "React Icons"],
    features: [
      "Fourteen page sections built as separate components (hero, stats, features, courses, testimonials, blog and footer, among others)",
      "Login and registration pages with Zod schemas and an error message under each field",
      "Form types inferred from the schemas with z.infer, so the validation rules and the TypeScript types can't drift apart",
      "Show/hide password toggle and responsive layouts from phone to desktop",
    ],
    contributions: ["Built on my own: layout, components, responsive styling and form validation"],
    caseStudy: {
      problem:
        "Turn a long marketing page into small components that are easy to maintain, and make the sign-in forms reject bad input before it is submitted.",
      audience: "Students and teachers visiting an online-learning platform's marketing site.",
      built: [
        "The home page composed from 14 section components",
        "Login and registration pages with field-level validation",
        "A shared navigation bar and layout",
      ],
      howItWorks: [
        "Each form keeps its fields in React state. On submit, the values are checked with the matching Zod schema's safeParse.",
        "Validation issues are mapped to field names, so each message appears under the input it belongs to.",
      ],
      decisions: [
        {
          title: "One schema, two jobs",
          detail:
            "LoginInput and RegisterInput are inferred from the Zod schemas, so changing a rule updates the type and the validation together.",
        },
      ],
      challenges: [
        {
          title: "Mapping validation errors to fields",
          detail:
            "Zod reports issues with a path. Reading the first path segment as a typed key of the form gives each field exactly its own message.",
        },
      ],
      nextSteps: [
        "Connect sign-in to a real authentication API; today the forms validate in the browser only and no account is created",
        "Fix the logo image, which doesn't load on the live site",
        "Replace the placeholder text on the registration page",
      ],
      snippet: {
        title: "Validation rules and types from one source",
        language: "typescript",
        source: "src/utils/authSchema.ts",
        code: `export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email Address is required' })
    .email({ message: 'Please enter a valid email address' }),
  username: z
    .string()
    .min(1, { message: 'User name is required' })
    .min(3, { message: 'User name must be at least 3 characters long' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;`,
      },
    },
  },
  {
    slug: "votingui-dom",
    name: "VotingUI · DOM",
    tagline: "The first version of the voting app: TypeScript and the DOM, no framework.",
    summary:
      "An online voting page written in TypeScript that works directly with the DOM, styled with Tailwind, with votes kept in localStorage, one vote per email and a 20-voter limit.",
    category: "frontend",
    kind: "learning",
    status: "not-deployed",
    period: "Aug 2026",
    accent: "#3ccf6e",
    monogram: "VD",
    featured: false,
    links: { repo: "https://github.com/Abigail56/VotingUI-DOM" },
    screenshot: {
      desktop: "/projects/votingui-dom.jpg",
      mobile: "/projects/votingui-dom-mobile.jpg",
      alt: "VotingUI DOM: a voter information form with name, email and candidate fields, and two candidate cards.",
      capturedFrom: "the repository's index.html, opened locally",
    },
    stack: ["TypeScript", "HTML", "Tailwind CSS (CDN)", "localStorage", "Font Awesome"],
    features: [
      "Voter form with name, email and candidate, validated before a vote is counted",
      "One vote per email address and a 20-voter limit, after which the form locks itself",
      "Results with vote counts and percentage bars, kept after a page reload",
      "TypeScript types for the domain: literal-union candidates, an as-const voter list, Record-based tallies and a type guard",
    ],
    contributions: ["Built on my own while learning TypeScript"],
    caseStudy: {
      problem: "Practise TypeScript's type system on a small, real interface before using a framework.",
      audience: "A small group voting from one shared browser.",
      built: [
        "A typed election module compiled from TypeScript to JavaScript",
        "Form handling, vote counting and results rendering written directly against the DOM",
      ],
      howItWorks: [
        "On submit, the form values are trimmed and checked; isCandidate() narrows the selected string to the TCandidate type.",
        "Votes and the emails that have voted are saved to localStorage, so the results survive a reload.",
      ],
      decisions: [
        {
          title: "Let the types describe the domain",
          detail:
            "Candidates are a union of string literals and the tally is Record<TCandidate, number>, so a misspelt candidate is a compile error, not a silent zero.",
        },
      ],
      challenges: [
        {
          title: "What re-reading it taught me",
          detail:
            "Going back to this code, I found three bugs that the types didn't catch: the winner is chosen by comparing only Lilian and Victor, 'Rita' is pushed onto a list that already contains her, and the candidate menu doesn't offer Rita at all. The one-vote-per-email rule can also be bypassed by clearing localStorage. Those lessons are why the Next.js version moved the rules to the server.",
        },
      ],
      nextSteps: [
        "Compute the winner from every candidate instead of a hard-coded comparison",
        "Build the candidate menu from the same candidates array the tally uses",
        "Publish it with GitHub Pages so it can be tried without cloning",
      ],
      snippet: {
        title: "The bug I found when I came back to it",
        language: "typescript",
        source: "election.ts",
        code: `type TCandidate = 'Lilian' | 'Victor' | 'Rita';

// ...after a vote is saved
result.winner = (votes.Lilian > votes.Victor) ? 'Lilian' : 'Victor';

// a fix: consider every candidate
result.winner = candidates.reduce((best, c) => (votes[c] > votes[best] ? c : best));`,
        note: "The first two lines are from the repository; the last line is the fix I'd make. This bug is also one of the Bug Hunter challenges in the Playground.",
      },
    },
  },
  {
    slug: "bean-brew",
    name: "Bean & Brew",
    tagline: "A responsive coffee-shop landing page, styled with Tailwind utility classes only.",
    summary:
      "A training assignment: take an unstyled HTML page for a fictional coffee shop and turn it into a polished, responsive site using only Tailwind utility classes, without changing the HTML structure or text.",
    category: "frontend",
    kind: "learning",
    status: "not-deployed",
    period: "Aug 2026",
    accent: "#a0521d",
    monogram: "BB",
    featured: false,
    links: {},
    repoNote: "The repository is private.",
    screenshot: {
      desktop: "/projects/bean-brew.jpg",
      mobile: "/projects/bean-brew-mobile.jpg",
      alt: "Bean & Brew landing page: 'Great coffee, made with love.' hero with Order Now and View Our Menu buttons, above three feature cards.",
      capturedFrom: "the repository's HTML, opened locally",
    },
    stack: ["HTML", "Tailwind CSS v4 (CLI build)", "JavaScript", "Font Awesome"],
    features: [
      "Navigation bar with a JavaScript mobile menu that switches between a bars icon and a close icon",
      "Hero with call-to-action buttons, a three-card features row that stacks on mobile, and a responsive menu grid",
      "A two-column About section and a contact form whose inputs have visible focus states",
      "A multi-column footer",
    ],
    contributions: ["Completed individually as a Tailwind CSS assignment during my software engineering training"],
    caseStudy: {
      problem:
        "Style a fixed HTML document using only utility classes, with no custom CSS and no changes to the structure, so that it works on a phone and a laptop.",
      audience: "Visitors to a small, fictional coffee shop's website.",
      built: ["Responsive styling for all seven sections of the page", "A small script for the mobile menu"],
      howItWorks: [
        "Tailwind's CLI compiles input.css into output.css, which contains only the utilities the page uses.",
        "Breakpoint prefixes (sm:, md:, lg:) switch the layouts from stacked on a phone to grids on wider screens.",
      ],
      decisions: [
        {
          title: "Constraints as practice",
          detail:
            "With no custom CSS allowed, every layout choice had to be expressed with flexbox, grid and spacing utilities. That is the vocabulary I now use in every Tailwind project.",
        },
      ],
      challenges: [
        {
          title: "Styling without changing the HTML",
          detail:
            "Layouts had to work with the markup as given, so grids and flex containers were applied to the existing elements instead of adding wrappers.",
        },
      ],
      nextSteps: ["Publish it on GitHub Pages", "Add aria-expanded to the mobile menu button (it already has an aria-label) so screen readers know when the menu is open"],
    },
  },
  {
    slug: "echovault-nexus",
    name: "EchoVault Nexus",
    tagline: "A new full-stack project, in its early setup stage.",
    summary:
      "My current project. So far it has its configuration, database setup and project structure; there are no product features to show yet, so this page lists only what exists.",
    category: "full-stack",
    kind: "product",
    status: "in-development",
    period: "Started Oct 2026",
    accent: "#45c4d6",
    monogram: "EV",
    featured: false,
    links: {},
    repoNote: "The repository isn't published yet.",
    stack: [
      "Python",
      "FastAPI",
      "SQLModel",
      "PostgreSQL 17 + pgvector",
      "Alembic",
      "PyJWT",
      "pwdlib (Argon2)",
      "Next.js 16",
      "Tailwind CSS v4",
      "DaisyUI",
    ],
    features: [
      "Typed settings with pydantic-settings: database URL, JWT secret and algorithm, 15-minute access tokens, allowed frontend origin",
      "Docker Compose database: PostgreSQL 17 with pgvector, bound to localhost only, with a health check",
      "Backend package structure for auth and knowledge endpoints, models, schemas, services and an AI module",
    ],
    contributions: ["Sole developer"],
    caseStudy: {
      problem:
        "Not described yet. I'll write up the problem it solves once the first feature works, rather than describe a product that doesn't exist yet.",
      audience: "To be defined with the first release.",
      built: [
        "Backend configuration loaded from environment variables, with no secrets in the code (.env.example documents each setting)",
        "A local PostgreSQL 17 + pgvector database in Docker Compose, reachable only from this machine",
        "Dependencies chosen for authentication (PyJWT, Argon2 hashing via pwdlib), migrations (Alembic) and tests (Pytest)",
        "A Next.js 16 frontend with Tailwind CSS v4 and DaisyUI",
      ],
      howItWorks: [],
      decisions: [
        {
          title: "Short-lived access tokens from day one",
          detail: "Access tokens are set to expire after 15 minutes in the default configuration, before any endpoint exists.",
        },
        {
          title: "Database not exposed to the network",
          detail: "The development database binds to 127.0.0.1, so it isn't reachable from other machines on the network.",
        },
      ],
      challenges: [],
      nextSteps: [
        "Implement registration and sign-in with hashed passwords and JWT access tokens",
        "Add the first database models and their Alembic migrations",
        "Publish the repository and write this case study properly",
      ],
    },
  },
];

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live Demo",
  "not-deployed": "Local Demo",
  "in-development": "In Development",
  planned: "Planned",
};

export const categoryLabels: Record<ProjectCategory, string> = {
  "full-stack": "Full-stack",
  frontend: "Frontend",
};

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { previous?: Project; next?: Project } {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return { previous: projects[index - 1], next: projects[index + 1] };
}

/** The smaller projects shown on the home page, strongest first. The rest are on /projects. */
export const homeAdditionalSlugs = ["votingui-nextjs", "iotc-landing-page", "votingui-dom"] as const;

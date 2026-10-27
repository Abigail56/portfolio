import type { CodeSnippet } from "@/lib/types";

export interface Relation {
  from: string;
  to: string;
  cardinality: "1 — 1" | "1 — many" | "many — many";
  note: string;
}

export interface EngineeringTopic {
  id: string;
  title: string;
  /** One line: what I do, not a definition. */
  lead: string;
  /** Slugs of the projects the examples come from. */
  projects: string[];
  points: string[];
  snippet?: CodeSnippet;
  relations?: Relation[];
}

// Every example comes from one of my repositories, or from this site's own code where it says so.
export const engineeringTopics: EngineeringTopic[] = [
  {
    id: "frontend-architecture",
    title: "Frontend architecture",
    lead: "I keep data access, state and presentation in separate places, so that each one can change without breaking the others.",
    projects: ["routebridge", "votingui-nextjs", "iotc-landing-page"],
    points: [
      "RouteBridge's console is organised by job: dispatch, orders, drivers, reconciliation, reports, platform and the public tracking pages each have their own route segment.",
      "In VotingUI, components never call fetch directly. A typed API client turns any non-2xx response into an ApiError that carries the status, and TanStack Query handles caching and refetching.",
      "On IOTC, a long marketing page is composed from 14 section components, so each one can be edited or reordered on its own.",
      "On this site, all content lives in typed data files. Pages, the terminal and the case studies render from the same source.",
    ],
    snippet: {
      title: "One place that decides what an error looks like",
      language: "typescript",
      source: "VotingUI-NEXT.JS · src/lib/api.ts",
      code: `export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error ?? 'Something went wrong.', res.status);
  }
  return data;
}`,
    },
  },
  {
    id: "api-design",
    title: "API design",
    lead: "Status codes that mean something, and endpoints that are safe to call twice.",
    projects: ["routebridge", "votingui-nextjs"],
    points: [
      "Creating an order accepts an Idempotency-Key. The first response is stored with a hash of the request; a retry returns the same response, and reusing the key for a different request is a 409.",
      "Invalid state changes are a 409 Conflict that names the transition, e.g. 'pending -> delivered', so the client knows exactly what was refused.",
      "Every operations route lives under /tenants/{tenant_id} and repeats the tenant check, so a valid id from another company still returns 404.",
      "VotingUI separates 400 (bad input), 403 (voting closed), 405 (with an Allow header) and 409 (already voted).",
    ],
    snippet: {
      title: "Retries return the original order",
      language: "python",
      source: "Route-Bridge · routes/orders.py",
      code: `@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(no_staff_orders)])
def create_order(
    tenant_id: UUID,
    payload: OrderCreate,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    session: Session = Depends(get_session),
) -> OrderRead:
    get_tenant_or_404(session, tenant_id)
    enforce(session, tenant_id, 'orders')

    request_hash = hashlib.sha256(
        json.dumps(payload.model_dump(mode="json"), sort_keys=True).encode("utf-8")
    ).hexdigest()
    if idempotency_key:
        previous = session.exec(
            select(IdempotencyRecord).where(
                IdempotencyRecord.tenant_id == tenant_id,
                IdempotencyRecord.key == idempotency_key,
            )
        ).first()
        if previous is not None:
            if previous.request_hash != request_hash:
                raise HTTPException(status_code=409, detail="Idempotency key was reused with a different request")
            return OrderRead.model_validate_json(previous.response_json)`,
    },
  },
  {
    id: "database-relationships",
    title: "Database relationships",
    lead: "I model the business first, then let the foreign keys enforce it.",
    projects: ["routebridge", "voxplay"],
    points: [
      "Every RouteBridge table that belongs to a company carries an indexed tenant_id, so isolating one company's data is a simple filter on every query, not an afterthought.",
      "An order has exactly one delivery job: order_id is unique on DeliveryJob, so the database itself enforces the one-to-one relationship.",
      "Payment is its own record, linked to the order and the job. Proof of delivery hangs off a specific delivery attempt, so a failed first attempt and a successful second one are both on record.",
      "In VoxPlay, voiceprints live next to player data in PostgreSQL as pgvector columns, so identifying a speaker is a single nearest-neighbour query.",
    ],
    relations: [
      { from: "Tenant", to: "TenantMembership", cardinality: "1 — many", note: "One row per user and workspace (unique together), holding the role" },
      { from: "Merchant", to: "Order", cardinality: "1 — many", note: "Orders also link to a Customer" },
      { from: "Order", to: "DeliveryJob", cardinality: "1 — 1", note: "Enforced by a unique order_id" },
      { from: "DeliveryJob", to: "Stop", cardinality: "1 — many", note: "Where the job goes" },
      { from: "DeliveryJob", to: "DeliveryAttempt", cardinality: "1 — many", note: "Numbered attempts with a reason code" },
      { from: "DeliveryAttempt", to: "ProofOfDelivery", cardinality: "1 — many", note: "Photo, code or signature evidence" },
      { from: "Driver", to: "DriverAssignment", cardinality: "1 — many", note: "Links drivers to jobs over time" },
      { from: "PaymentRecord", to: "ReconciliationItem", cardinality: "1 — many", note: "Opened when the collected amount differs from the expected one" },
    ],
  },
  {
    id: "auth",
    title: "Authentication & authorization",
    lead: "Who you are is checked once per request; what you may do is checked at every route.",
    projects: ["routebridge", "voxplay"],
    points: [
      "RouteBridge: Argon2id password hashes, Continue with Google using OAuth with PKCE (the ID token is checked against Google's keys), password reset by emailed link, and signed httpOnly, SameSite=Lax session cookies.",
      "Roles are attached per workspace (TenantMembership), not globally, so the same person can be an owner in one company and have no access to another.",
      "Role checks are declared on the router, so every endpoint in the module inherits them and none can be forgotten.",
      "Sign-in, sign-up and password reset are rate limited, and the API enforces a maximum session length on its own, not only through the web app.",
      "VoxPlay uses salted scrypt hashes and JWT bearer tokens, with guest players who can save an account later.",
    ],
    snippet: {
      title: "Roles declared once, for a whole router",
      language: "python",
      source: "Route-Bridge · routes/operations.py & auth/authorization.py",
      code: `OPERATIONS_ROLES = ("tenant_owner", "tenant_admin", "dispatcher", "operations_manager")
router = APIRouter(
    prefix="/tenants/{tenant_id}",
    tags=["delivery-operations"],
    dependencies=[Depends(tenant_roles(*OPERATIONS_ROLES))],
)

def tenant_roles(*roles: str):
    invalid = set(roles) - ROLES
    if invalid:
        raise ValueError(f"Unknown roles: {sorted(invalid)}")
    ...`,
      note: "A typo in a role name fails when the app starts, not silently at request time.",
    },
  },
  {
    id: "error-handling",
    title: "Error handling",
    lead: "Failures should be visible, specific and recoverable, never silent.",
    projects: ["routebridge", "votingui-nextjs", "voxplay"],
    points: [
      "VotingUI's castVote returns a discriminated union ({ ok: true } or { ok: false, status, error }) instead of throwing, so TypeScript makes every caller handle failure.",
      "RouteBridge's API refuses to start in production with unsafe settings and prints every problem at once, not just the first one.",
      "Rejected offline events stay on the driver's phone for correction and are never dropped silently.",
      "VoxPlay holds suspicious answers for the host to judge instead of punishing anyone automatically: a false alarm costs one tap.",
      "This site's contact form only says 'sent' when the email provider confirms it. If sending isn't configured, it says so and offers the email link.",
    ],
  },
  {
    id: "responsive-design",
    title: "Responsive design",
    lead: "Mobile layouts are designed, not just squeezed.",
    projects: ["bean-brew", "iotc-landing-page", "routebridge"],
    points: [
      "Bean & Brew had to be made responsive with Tailwind breakpoint prefixes only, on markup I wasn't allowed to change.",
      "IOTC's hero switches from a stacked mobile layout to a split desktop layout and changes its clip-path curve at the md breakpoint.",
      "RouteBridge's driver app is phone-first and installable, because that is where riders use it.",
      "This site is checked by an automated test at 360 px and 1440 px wide for horizontal overflow on every page.",
    ],
  },
  {
    id: "testing",
    title: "Testing",
    lead: "Test the rules that would hurt most if they broke.",
    projects: ["routebridge", "voxplay"],
    points: [
      "RouteBridge has 44 Pytest modules covering access control, orders, delivery codes, reconciliation, live events, webhook replay and the production guards. They run on SQLite by default, with a separate integration test against PostgreSQL and PostGIS.",
      "Its driver app has Vitest unit tests (with fake-indexeddb for the offline store) and a Playwright browser test.",
      "VoxPlay's question-bank test runs every answer and accepted alternative through the real answer checker, and checks that every category is playable.",
      "This site has unit tests for the terminal, the games, the contact validation, the project data and colour contrast, plus a browser smoke test over every route.",
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    lead: "One command to run it, and configuration that fails loudly.",
    projects: ["routebridge", "votingui-nextjs", "iotc-landing-page", "voxplay"],
    points: [
      "RouteBridge runs from one docker compose command: PostgreSQL with PostGIS, Redis, MinIO, the API (which migrates the database first), three workers and the web app, with optional HTTPS and backup profiles.",
      "It is deployed on Render; the repository includes a Render Blueprint and guides for deploying with and without a domain.",
      "The Next.js projects (VotingUI, IOTC) are deployed on Vercel.",
      "Secrets are only read from environment variables. The repositories ship a commented .env.example and never a real .env.",
    ],
  },
];

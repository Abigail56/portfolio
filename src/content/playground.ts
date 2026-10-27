// Content for the Playground. The answers are checked by tests/playground.test.ts, which runs the
// JavaScript questions for real, so a wrong answer key fails the build instead of reaching visitors.

export interface QuizQuestion {
  id: string;
  topic: "JavaScript" | "TypeScript" | "Python" | "HTTP" | "SQL" | "React" | "Security" | "CSS";
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "typeof-null",
    topic: "JavaScript",
    prompt: "What does this print?",
    code: "console.log(typeof null);",
    options: ['"null"', '"object"', '"undefined"', "It throws a TypeError"],
    answer: 1,
    explanation:
      'typeof null is "object", a bug kept since the first version of JavaScript for compatibility. Check for null with value === null.',
  },
  {
    id: "event-loop",
    topic: "JavaScript",
    prompt: "In what order are the letters logged?",
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    options: ["A B C D", "A D B C", "A D C B", "A C D B"],
    answer: 2,
    explanation:
      "Synchronous code runs first (A, D). Promise callbacks are microtasks and run before timers, which are macrotasks, so C comes before B.",
  },
  {
    id: "map-parseint",
    topic: "JavaScript",
    prompt: "What is the result?",
    code: `["1", "2", "3"].map(parseInt);`,
    options: ["[1, 2, 3]", "[1, NaN, NaN]", '["1", "2", "3"]', "[NaN, NaN, NaN]"],
    answer: 1,
    explanation:
      'map passes (value, index), so this calls parseInt("2", 1) and parseInt("3", 2). Radix 1 is invalid and "3" isn\'t a binary digit, so both are NaN. Use .map(Number).',
  },
  {
    id: "as-const",
    topic: "TypeScript",
    prompt: "What is the type of roles?",
    code: `const roles = ["admin", "driver"] as const;`,
    options: ["string[]", '("admin" | "driver")[]', 'readonly ["admin", "driver"]', "readonly string[]"],
    answer: 2,
    explanation:
      "as const makes the array a readonly tuple of literal types. typeof roles[number] then gives the union \"admin\" | \"driver\", which is handy for role checks.",
  },
  {
    id: "mutable-default",
    topic: "Python",
    prompt: "What does the last line print?",
    code: `def add(item, items=[]):
    items.append(item)
    return items

add(1)
print(add(2))`,
    options: ["[2]", "[1, 2]", "[1]", "It raises a TypeError"],
    answer: 1,
    explanation:
      "Default values are created once, when the function is defined, so every call shares the same list. Use items=None and create the list inside.",
  },
  {
    id: "fastapi-422",
    topic: "Python",
    prompt: "A FastAPI route is declared as @app.get(\"/items/{item_id}\") with item_id: int. What does GET /items/abc return?",
    options: ["200 with item_id = 0", "404 Not Found", "422 Unprocessable Entity", "500 Internal Server Error"],
    answer: 2,
    explanation:
      "FastAPI validates path parameters against their type hints. \"abc\" isn't an int, so it responds 422 with details of the validation error before your function runs.",
  },
  {
    id: "401-403",
    topic: "HTTP",
    prompt: "A signed-in user calls an endpoint their role isn't allowed to use. Which status code fits best?",
    options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
    answer: 2,
    explanation:
      "401 means the request isn't authenticated. 403 means we know who you are, and you aren't allowed. (Some APIs return 404 instead, to avoid confirming that a resource exists.)",
  },
  {
    id: "idempotency",
    topic: "HTTP",
    prompt: "A phone retries a POST /orders because the response was lost, but the first request had succeeded. What stops a duplicate order?",
    options: [
      "Switching the endpoint to PUT",
      "An idempotency key the server remembers",
      "A shorter request timeout",
      "Caching the response in the browser",
    ],
    answer: 1,
    explanation:
      "The client sends the same Idempotency-Key with every retry. The server stores the first result for that key and returns it again instead of creating a second order. RouteBridge does this for order creation.",
  },
  {
    id: "one-to-one",
    topic: "SQL",
    prompt: "delivery_jobs.order_id is a foreign key to orders.id. What else makes it a strict one-to-one relationship?",
    options: [
      "An index on order_id",
      "A UNIQUE constraint on order_id",
      "ON DELETE CASCADE",
      "Making order_id the first column",
    ],
    answer: 1,
    explanation:
      "A foreign key on its own allows many jobs per order. Adding UNIQUE means each order can appear only once, so each order has at most one job.",
  },
  {
    id: "react-batching",
    topic: "React",
    prompt: "count is 0. After one click, what is count?",
    code: `function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
}`,
    options: ["0", "1", "2", "It depends on the browser"],
    answer: 1,
    explanation:
      "Both calls read the same count from this render (0), so both set it to 1. To apply both, use the updater form: setCount(c => c + 1).",
  },
  {
    id: "password-storage",
    topic: "Security",
    prompt: "How should a web app store user passwords?",
    options: [
      "Encrypted with AES, so they can be recovered",
      "Hashed with SHA-256",
      "Hashed with a slow, salted algorithm such as Argon2id",
      "Base64-encoded in a separate table",
    ],
    answer: 2,
    explanation:
      "Passwords should never be recoverable. Fast hashes like SHA-256 are cheap to brute-force; Argon2id is salted and deliberately slow and memory-hard.",
  },
  {
    id: "tailwind-breakpoint",
    topic: "CSS",
    prompt: 'When does the Tailwind class "md:grid-cols-3" apply?',
    options: [
      "Only on medium screens",
      "At 768px wide and above",
      "Below 768px",
      "Only when the user prefers a medium font size",
    ],
    answer: 1,
    explanation:
      "Tailwind is mobile-first: an md: prefix means min-width: 768px and up. Unprefixed classes are the mobile default.",
  },
];

export interface BugChallenge {
  id: string;
  title: string;
  language: "typescript" | "python" | "tsx";
  context: string;
  lines: string[];
  /** 1-based line number of the bug. */
  bugLine: number;
  explanation: string;
  fix: string;
  origin?: string;
}

export const bugChallenges: BugChallenge[] = [
  {
    id: "winner-two-way",
    title: "The election with a missing candidate",
    language: "typescript",
    context: "Three candidates can receive votes. After each vote, the app records the winner.",
    lines: [
      "type TCandidate = 'Lilian' | 'Victor' | 'Rita';",
      "const candidates: TCandidate[] = ['Lilian', 'Victor', 'Rita'];",
      "",
      "function recordWinner(votes: Record<TCandidate, number>) {",
      "  result.poll = { ...votes };",
      "  result.winner = votes.Lilian > votes.Victor ? 'Lilian' : 'Victor';",
      "}",
    ],
    bugLine: 6,
    explanation:
      "The winner is chosen by comparing only Lilian and Victor, so Rita can never win, even with every vote. It still type-checks, because both branches are valid TCandidate values.",
    fix: "result.winner = candidates.reduce((best, c) => (votes[c] > votes[best] ? c : best));",
    origin: "Found in my own VotingUI DOM project when I re-read it.",
  },
  {
    id: "tenant-leak",
    title: "Another company's delivery",
    language: "python",
    context: "Every company (tenant) must only see its own delivery jobs.",
    lines: [
      '@router.get("/tenants/{tenant_id}/jobs/{job_id}")',
      "def read_job(tenant_id: UUID, job_id: UUID, session: Session = Depends(get_session)):",
      "    job = session.get(DeliveryJob, job_id)",
      "    if job is None:",
      '        raise HTTPException(status_code=404, detail="Delivery job not found")',
      "    return job",
    ],
    bugLine: 4,
    explanation:
      "The job is looked up by id only. Anyone with access to their own tenant can read another company's job by putting its id in the URL (an IDOR bug).",
    fix: "if job is None or job.tenant_id != tenant_id:",
    origin: "RouteBridge's real get_job() includes the tenant check.",
  },
  {
    id: "sql-injection",
    title: "A search that runs your SQL",
    language: "python",
    context: "Find users by name.",
    lines: [
      '@app.get("/users")',
      "def find_users(name: str, db: Session = Depends(get_db)):",
      "    query = f\"SELECT id, name FROM users WHERE name = '{name}'\"",
      "    return db.execute(text(query)).all()",
    ],
    bugLine: 3,
    explanation:
      "The user's input is pasted into the SQL string. A name like ' OR '1'='1 changes the query itself (SQL injection).",
    fix: 'db.execute(text("SELECT id, name FROM users WHERE name = :name"), {"name": name})',
  },
  {
    id: "foreach-async",
    title: "Saved… or not yet?",
    language: "typescript",
    context: "Save every order, then report that saving is done.",
    lines: [
      "async function saveAll(orders: Order[]) {",
      "  orders.forEach(async (order) => {",
      "    await api.save(order);",
      "  });",
      '  console.log("All orders saved");',
      "}",
    ],
    bugLine: 2,
    explanation:
      "forEach ignores the promises its callback returns, so saveAll logs (and resolves) before any save finishes, and failed saves are never caught.",
    fix: "await Promise.all(orders.map((order) => api.save(order)));  // or a for...of loop to save one at a time",
  },
  {
    id: "state-mutation",
    title: "The list that won't update",
    language: "tsx",
    context: "Adding a todo should show it in the list.",
    lines: [
      "const [todos, setTodos] = useState<string[]>([]);",
      "",
      "function add(text: string) {",
      "  todos.push(text);",
      "  setTodos(todos);",
      "}",
    ],
    bugLine: 4,
    explanation:
      "The existing array is mutated and then passed back to setTodos. It is the same reference, so React sees no change and may skip the re-render.",
    fix: "setTodos((prev) => [...prev, text]);",
  },
  {
    id: "pagination",
    title: "Page one starts on page two",
    language: "typescript",
    context: "The UI numbers pages from 1: paginate(items, 1, 10) should return the first ten items.",
    lines: [
      "function paginate<T>(items: T[], page: number, size: number): T[] {",
      "  const start = page * size;",
      "  return items.slice(start, start + size);",
      "}",
    ],
    bugLine: 2,
    explanation: "With pages numbered from 1, page 1 starts at index 10, so the first ten items are never shown.",
    fix: "const start = (page - 1) * size;",
  },
];

export interface MemoryPair {
  id: string;
  term: string;
  meaning: string;
}

export const memoryPairs: MemoryPair[] = [
  { id: "postgres", term: "PostgreSQL", meaning: "Relational database" },
  { id: "redis", term: "Redis", meaning: "In-memory store: cache, locks, pub/sub" },
  { id: "fastapi", term: "FastAPI", meaning: "Python framework for typed APIs" },
  { id: "nextjs", term: "Next.js", meaning: "React framework with routing and rendering" },
  { id: "docker", term: "Docker", meaning: "Packages apps into containers" },
  { id: "argon2", term: "Argon2id", meaning: "Password hashing" },
  { id: "pgvector", term: "pgvector", meaning: "Vector similarity search in Postgres" },
  { id: "tailwind", term: "Tailwind CSS", meaning: "Utility-first styling" },
];

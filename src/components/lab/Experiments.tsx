import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { attemptTransition, createOrder, DELIVERY_STATES, emptyServer, isTerminal, slideWindow, ALLOWED_TRANSITIONS, type SimServer } from "@/lib/experiments";
import { cn } from "@/lib/cn";

const panel = "rounded-xl border border-line bg-surface p-5 sm:p-6";
const logBox = "mt-3 max-h-64 min-h-24 overflow-y-auto rounded-lg border border-line bg-code-bg p-3 font-mono text-xs leading-relaxed text-code-fg";
const heading = "text-card text-fg";

function Log({ lines, empty }: { lines: { text: string; ok: boolean }[]; empty: string }) {
  return (
    <div role="log" aria-live="polite" tabIndex={0} aria-label="Result log" className={logBox}>
      {lines.length === 0 && <p className="text-[#a3adc2]">{empty}</p>}
      {lines.map((l, i) => (
        <p key={`${i}-${l.text}`} className={l.ok ? "text-[#86efac]" : "text-[#fda4af]"}>
          {l.text}
        </p>
      ))}
    </div>
  );
}

/** Every target state is offered, valid or not, because seeing a move refused is the point. */
export function StateMachineLab() {
  const [state, setState] = useState("pending");
  const [log, setLog] = useState<{ text: string; ok: boolean }[]>([]);

  function move(target: string) {
    const result = attemptTransition(state, target);
    setLog((l) => [{ ok: result.status === 200, text: result.status === 200 ? `200 OK  ${state} -> ${target}` : `409 Conflict  ${result.detail}` }, ...l]);
    setState(result.state);
  }

  const allowed = ALLOWED_TRANSITIONS[state] ?? [];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className={panel} aria-labelledby="sm-title">
        <h2 id="sm-title" className={heading}>
          Delivery job
        </h2>
        <p className="mt-3 text-sm text-muted">
          Current status: <strong data-testid="sm-state" className="font-mono text-base text-accent">{state}</strong>
          {isTerminal(state) && <span> (final: the table has no moves out of it)</span>}
        </p>
        <h3 className="text-meta mt-6 font-semibold text-fg">Request a move to</h3>
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DELIVERY_STATES.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => move(s)}
                className={cn(
                  "min-h-11 w-full rounded-lg border px-2 py-2 font-mono text-xs transition-colors hover:bg-surface-3",
                  allowed.includes(s) ? "border-accent-line text-fg" : "border-line text-muted",
                )}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-meta mt-3 text-subtle">Outlined in blue: moves the table allows from the current status.</p>
        <Button variant="secondary" size="sm" className="mt-5" onClick={() => { setState("pending"); setLog([]); }}>
          <RotateCcw aria-hidden className="size-4" />
          Start a new job
        </Button>
      </section>
      <section className={panel} aria-labelledby="sm-log">
        <h2 id="sm-log" className={heading}>API responses</h2>
        <Log lines={log} empty="Nothing requested yet. Try jumping straight to delivered." />
        <p className="text-meta mt-4 text-muted">
          Why it matters: RouteBridge&apos;s online API and its driver sync import the same table, so a replayed event can&apos;t make a move the API would refuse.
        </p>
      </section>
    </div>
  );
}

export function IdempotencyLab() {
  const [useKey, setUseKey] = useState(false);
  const [server, setServer] = useState<SimServer>(emptyServer);
  const [pendingKey, setPendingKey] = useState<string | null | undefined>(undefined);
  const [log, setLog] = useState<{ text: string; ok: boolean }[]>([]);
  const [placed, setPlaced] = useState(0);

  const add = (text: string, ok: boolean) => setLog((l) => [{ text, ok }, ...l]);

  /** Sends a request. A "lost" response means the server did the work but the client never heard back. */
  function send(key: string | null, lost: boolean, label: string) {
    const result = createOrder(server, key);
    setServer(result.server);
    const header = key ? ` Idempotency-Key: ${key}` : "";
    if (lost) {
      add(`${label}${header} -> order saved, response lost`, false);
      setPendingKey(key);
    } else {
      add(`${label}${header} -> 201 order #${result.order.id}${result.replayed ? " (original returned, nothing created)" : ""}`, true);
      setPendingKey(undefined);
    }
  }

  function placeOrder(lost: boolean) {
    const count = placed + 1;
    setPlaced(count);
    send(useKey ? `order-${count}` : null, lost, "POST /orders");
  }

  function reset() {
    setServer(emptyServer);
    setLog([]);
    setPendingKey(undefined);
    setPlaced(0);
  }

  const waiting = pendingKey !== undefined;
  const hasDuplicate = server.orders.length > placed;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
      <section className={panel} aria-labelledby="idem-client">
        <h2 id="idem-client" className={heading}>Client</h2>
        <label className="mt-4 flex min-h-11 items-center gap-3 text-sm text-fg">
          <input type="checkbox" className="size-4 accent-[var(--accent-solid)]" checked={useKey} disabled={waiting} onChange={(e) => setUseKey(e.target.checked)} />
          Send an Idempotency-Key header
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button disabled={waiting} onClick={() => placeOrder(true)}>Place order, lose the response</Button>
          <Button variant="secondary" disabled={waiting} onClick={() => placeOrder(false)}>Place order normally</Button>
          <Button variant="secondary" disabled={!waiting} onClick={() => send(pendingKey ?? null, false, "Retry POST /orders")}>
            <ArrowRight aria-hidden className="size-4" />
            Retry
          </Button>
        </div>
        <Log lines={log} empty="Lose a response, then retry. The client can't tell whether the order was saved." />
      </section>
      <section className={panel} aria-labelledby="idem-server">
        <h2 id="idem-server" className={heading}>Server: orders table</h2>
        <p className="mt-2 text-sm text-muted" data-testid="idem-count">
          {server.orders.length} {server.orders.length === 1 ? "order" : "orders"} stored
        </p>
        <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2 font-mono text-xs">
          {server.orders.map((o) => (
            <li key={o.id} className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-fg">
              #{o.id} <span className="text-muted">key: {o.key ?? "none"}</span>
            </li>
          ))}
        </ul>
        <p className="text-meta mt-4 text-muted">
          {hasDuplicate
            ? "Without a key, the server can't tell a retry from a new order, so one customer action can create two orders."
            : "With a key, the server recognises a retry and returns the order it already created. Without one, a retry looks like a new order."}
        </p>
        <Button variant="secondary" size="sm" className="mt-4" onClick={reset}>
          <RotateCcw aria-hidden className="size-4" />
          Reset
        </Button>
      </section>
    </div>
  );
}

const LIMIT = 5;
const WINDOW_MS = 10_000;

export function RateLimiterLab() {
  const [hits, setHits] = useState<number[]>([]);
  const [now, setNow] = useState(0);
  const [log, setLog] = useState<{ text: string; ok: boolean }[]>([]);
  const hitsRef = useRef<number[]>([]);

  // The clock only runs while requests are in the window, so an idle page does no work.
  const active = hits.some((t) => now - t < WINDOW_MS);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [active]);

  function request(count: number) {
    const time = Date.now();
    const lines: { text: string; ok: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      const r = slideWindow(hitsRef.current, time, LIMIT, WINDOW_MS);
      hitsRef.current = r.hits;
      lines.unshift(r.allowed ? { ok: true, text: "200 OK" } : { ok: false, text: `429 Too Many Requests  Retry-After: ${Math.ceil(r.retryAfterMs / 1000)}s` });
    }
    setHits(hitsRef.current);
    setNow(time);
    setLog((l) => [...lines, ...l].slice(0, 40));
  }

  const inWindow = hits.filter((t) => now - t < WINDOW_MS);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className={panel} aria-labelledby="rl-title">
        <h2 id="rl-title" className={heading}>
          {LIMIT} requests per {WINDOW_MS / 1000} seconds
        </h2>
        <p className="mt-2 text-sm text-muted" data-testid="rl-count">
          {inWindow.length} of {LIMIT} used
        </p>
        <ol aria-hidden className="mt-4 grid grid-cols-5 gap-2">
          {Array.from({ length: LIMIT }, (_, i) => {
            const t = inWindow[i];
            const left = t === undefined ? 0 : Math.max(0, 1 - (now - t) / WINDOW_MS);
            return (
              <li key={i} className="h-16 overflow-hidden rounded-lg border border-line bg-surface-2">
                <div className="h-full origin-bottom bg-accent-solid transition-transform duration-200 ease-linear" style={{ transform: `scaleY(${left})` }} />
              </li>
            );
          })}
        </ol>
        <p className="text-meta mt-2 text-subtle">Each bar drains as that request ages out of the window, freeing its slot.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={() => request(1)}>Send a request</Button>
          <Button variant="secondary" onClick={() => request(8)}>Send a burst of 8</Button>
        </div>
      </section>
      <section className={panel} aria-labelledby="rl-log">
        <h2 id="rl-log" className={heading}>Responses</h2>
        <Log lines={log} empty="Send a burst to pass the limit." />
        <p className="text-meta mt-4 text-muted">
          This site&apos;s contact API uses this same function: five messages per 15 minutes for each address.
        </p>
      </section>
    </div>
  );
}

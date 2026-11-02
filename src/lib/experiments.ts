// Pure logic behind the Interactive Lab's engineering experiments. No React, so it can be unit tested,
// and slideWindow also runs in production: the contact API's rate limiter is built on it.

// ---- Delivery state machine. Mirrors ALLOWED_TRANSITIONS in RouteBridge's routes/operations.py; keep them identical.
export const ALLOWED_TRANSITIONS: Record<string, readonly string[]> = {
  pending: ["assigned", "cancelled"],
  assigned: ["accepted", "cancelled"],
  accepted: ["en_route", "cancelled"],
  en_route: ["arrived", "cancelled"],
  arrived: ["delivered", "failed_attempt", "cancelled"],
  failed_attempt: ["rescheduled", "returned", "cancelled"],
  rescheduled: ["assigned", "cancelled"],
};

export const DELIVERY_STATES = ["pending", "assigned", "accepted", "en_route", "arrived", "delivered", "failed_attempt", "rescheduled", "returned", "cancelled"] as const;

export type TransitionResult = { status: 200; state: string } | { status: 409; state: string; detail: string };

export function attemptTransition(current: string, target: string): TransitionResult {
  if (ALLOWED_TRANSITIONS[current]?.includes(target)) return { status: 200, state: target };
  return { status: 409, state: current, detail: `Invalid transition: ${current} -> ${target}` };
}

export const isTerminal = (state: string) => !ALLOWED_TRANSITIONS[state];

// ---- Idempotent order creation.
export interface SimOrder {
  id: number;
  key: string | null;
}

export interface SimServer {
  orders: SimOrder[];
  nextId: number;
}

export const emptyServer: SimServer = { orders: [], nextId: 1001 };

/** Handles one "create order" request. A repeated key returns the original order instead of creating another. */
export function createOrder(server: SimServer, key: string | null): { server: SimServer; order: SimOrder; replayed: boolean } {
  const existing = key ? server.orders.find((o) => o.key === key) : undefined;
  if (existing) return { server, order: existing, replayed: true };
  const order = { id: server.nextId, key };
  return { server: { orders: [...server.orders, order], nextId: server.nextId + 1 }, order, replayed: false };
}

// ---- Sliding-window rate limiting.
export interface WindowResult {
  /** Timestamps still inside the window, including this request when it was allowed. */
  hits: number[];
  allowed: boolean;
  retryAfterMs: number;
}

export function slideWindow(previous: readonly number[], now: number, limit: number, windowMs: number): WindowResult {
  const recent = previous.filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    return { hits: recent, allowed: false, retryAfterMs: windowMs - (now - oldest) };
  }
  return { hits: [...recent, now], allowed: true, retryAfterMs: 0 };
}

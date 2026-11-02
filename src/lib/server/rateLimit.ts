import { slideWindow } from "@/lib/experiments";

// A small sliding-window rate limiter kept in memory.
// On a serverless host each instance has its own memory, so this is a speed bump against
// accidental double-submits and simple scripts, not a guarantee. Use a shared store (e.g. Redis) for more.

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number, now: number = Date.now()): RateLimitResult {
  const { hits: recent, allowed, retryAfterMs } = slideWindow(hits.get(key) ?? [], now, limit, windowMs);
  hits.set(key, recent);
  return { allowed, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
}

export function resetRateLimits(): void {
  hits.clear();
}

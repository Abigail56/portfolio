import { describe, expect, it } from "vitest";
import { ALLOWED_TRANSITIONS, attemptTransition, createOrder, DELIVERY_STATES, emptyServer, isTerminal, slideWindow } from "@/lib/experiments";
import { getProject } from "@/content/projects";

describe("delivery state machine", () => {
  it("allows a listed move and refuses anything else with a 409", () => {
    expect(attemptTransition("pending", "assigned")).toEqual({ status: 200, state: "assigned" });
    expect(attemptTransition("pending", "delivered")).toMatchObject({ status: 409, state: "pending", detail: "Invalid transition: pending -> delivered" });
  });

  it("stops at terminal states", () => {
    expect(["delivered", "returned", "cancelled"].every(isTerminal)).toBe(true);
    expect(attemptTransition("delivered", "pending").status).toBe(409);
  });

  it("only uses known states", () => {
    for (const targets of Object.values(ALLOWED_TRANSITIONS)) for (const t of targets) expect(DELIVERY_STATES).toContain(t);
  });

  it("matches the table quoted in the RouteBridge case study", () => {
    const quoted = getProject("routebridge")!.caseStudy.snippet!.code;
    for (const [from, targets] of Object.entries(ALLOWED_TRANSITIONS)) {
      const line = quoted.split("\n").find((l) => l.includes(`"${from}": {`))!;
      expect([...line.matchAll(/"([a-z_]+)"/g)].slice(1).map((m) => m[1]).sort()).toEqual([...targets].sort());
    }
  });
});

describe("idempotent order creation", () => {
  it("creates a duplicate when a retry has no key", () => {
    const first = createOrder(emptyServer, null);
    const second = createOrder(first.server, null);
    expect(second.server.orders).toHaveLength(2);
    expect(second.replayed).toBe(false);
  });

  it("returns the original order when a key repeats", () => {
    const first = createOrder(emptyServer, "k1");
    const retry = createOrder(first.server, "k1");
    expect(retry.server.orders).toHaveLength(1);
    expect(retry.order.id).toBe(first.order.id);
    expect(retry.replayed).toBe(true);
  });
});

describe("sliding window", () => {
  it("refuses over the limit and says when to retry", () => {
    let hits: number[] = [];
    for (const now of [0, 100]) hits = slideWindow(hits, now, 2, 1000).hits;
    const refused = slideWindow(hits, 200, 2, 1000);
    expect(refused.allowed).toBe(false);
    expect(refused.retryAfterMs).toBe(800);
  });

  it("allows again once old requests leave the window", () => {
    const result = slideWindow([0, 100], 1000, 2, 1000);
    expect(result.allowed).toBe(true);
    expect(result.hits).toEqual([100, 1000]);
  });
});

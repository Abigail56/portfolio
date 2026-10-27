import type { NextApiRequest, NextApiResponse } from "next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "@/pages/api/contact";
import { contactSchema } from "@/lib/contact";
import { checkRateLimit, resetRateLimits } from "@/lib/server/rateLimit";

const valid = { name: "Ada Obi", email: "ada@example.com", message: "Hello! I'd like to talk about a frontend role on our team." };

function call(body: unknown, method = "POST", ip = "203.0.113.7") {
  const req = { method, body, headers: { "x-forwarded-for": ip }, socket: { remoteAddress: ip } } as unknown as NextApiRequest;
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    payload: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(key: string, value: string) {
      this.headers[key] = value;
      return this;
    },
    json(data: unknown) {
      this.payload = data;
      return this;
    },
  };
  return handler(req, res as unknown as NextApiResponse).then(() => res);
}

describe("contact schema", () => {
  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it.each([
    [{ ...valid, name: "A" }, "name"],
    [{ ...valid, email: "not-an-email" }, "email"],
    [{ ...valid, message: "too short" }, "message"],
    [{ ...valid, website: "http://spam" }, "website"],
  ])("rejects %o", (input, field) => {
    const result = contactSchema.safeParse(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path[0] === field)).toBe(true);
  });
});

describe("POST /api/contact", () => {
  const env = { ...process.env };
  beforeEach(() => {
    resetRateLimits();
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_TO_EMAIL = "me@example.com";
    process.env.CONTACT_FROM_EMAIL = "Site <site@example.com>";
  });
  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllGlobals();
  });

  it("reports success only when the provider accepts the email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await call(valid);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ ok: true });
    const [, init] = fetchMock.mock.calls[0]!;
    const sent = JSON.parse(init.body);
    expect(sent.reply_to).toBe(valid.email);
    expect(init.headers.Authorization).toBe("Bearer test-key");
  });

  it("does not claim success when the provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "invalid from" }), { status: 422 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call(valid);
    expect(res.statusCode).toBe(502);
    expect(res.payload).toMatchObject({ ok: false, reason: "provider" });
  });

  it("does not claim success when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await call(valid);
    expect(res.statusCode).toBe(502);
  });

  it("says so when email isn't configured", async () => {
    delete process.env.RESEND_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await call(valid);
    expect(res.statusCode).toBe(503);
    expect(res.payload).toMatchObject({ ok: false, reason: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input without calling the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await call({ ...valid, email: "nope" });
    expect(res.statusCode).toBe(400);
    expect(res.payload).toMatchObject({ ok: false, fieldErrors: { email: expect.any(String) } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects other methods with an Allow header", async () => {
    const res = await call(undefined, "GET");
    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("POST");
  });

  it("rate limits repeated messages from one address", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(JSON.stringify({ id: "x" }), { status: 200 })));
    for (let i = 0; i < 5; i++) expect((await call(valid)).statusCode).toBe(200);
    const blocked = await call(valid);
    expect(blocked.statusCode).toBe(429);
    expect(Number(blocked.headers["Retry-After"])).toBeGreaterThan(0);
    expect((await call(valid, "POST", "198.51.100.1")).statusCode).toBe(200);
  });
});

describe("rate limiter", () => {
  it("frees up again after the window", () => {
    resetRateLimits();
    for (let i = 0; i < 3; i++) expect(checkRateLimit("k", 3, 1000, 0).allowed).toBe(true);
    expect(checkRateLimit("k", 3, 1000, 500).allowed).toBe(false);
    expect(checkRateLimit("k", 3, 1000, 1001).allowed).toBe(true);
  });
});

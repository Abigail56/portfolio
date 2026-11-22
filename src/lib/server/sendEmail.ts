import https from "node:https";

// Sends the contact message through Resend's HTTP API. The API key is read on the server only and is
// never sent to the browser. Returns a result instead of throwing, so the route can answer precisely.

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SendResult = { ok: true; id: string } | { ok: false; reason: "not-configured" | "provider"; detail?: string };

function sendWithHttps(apiKey: string, from: string, to: string, msg: ContactMessage): Promise<SendResult> {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      from,
      to: [to],
      reply_to: msg.email,
      subject: `[Portfolio] ${msg.subject}`,
      text: `${msg.message}\n\n---\nFrom: ${msg.name} <${msg.email}>\nSent via the contact form on the portfolio of Chukwu Chinecherem`,
    });
    const request = https.request(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        let data = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => { data += chunk; });
        response.on("end", () => {
          let parsed: { id?: string; message?: string } = {};
          try { parsed = JSON.parse(data); } catch { /* Provider returned a non-JSON response. */ }
          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300 && parsed.id) {
            resolve({ ok: true, id: parsed.id });
          } else {
            resolve({ ok: false, reason: "provider", detail: parsed.message || `HTTP ${response.statusCode || "unknown"}; ${data || "empty response"}` });
          }
        });
      },
    );
    request.setTimeout(10_000, () => request.destroy(new Error("Resend request timed out")));
    request.on("error", (err) => {
      const cause = err.cause instanceof Error ? `; cause=${err.cause.message}` : "";
      const code = "code" in err && typeof err.code === "string" ? `; code=${err.code}` : "";
      resolve({ ok: false, reason: "provider", detail: `${err.message || "HTTPS request failed"}${code}${cause}` });
    });
    request.end(body);
  });
}

export async function sendContactEmail(msg: ContactMessage, env: NodeJS.ProcessEnv = process.env): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: msg.email,
        subject: `[Portfolio] ${msg.subject}`,
        text: `${msg.message}\n\n---\nFrom: ${msg.name} <${msg.email}>\nSent via the contact form on the portfolio of Chukwu Chinecherem`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !data.id) return { ok: false, reason: "provider", detail: data.message ?? `HTTP ${res.status}` };
    return { ok: true, id: data.id };
  } catch (err) {
    if (process.env.NODE_ENV !== "test") {
      return sendWithHttps(apiKey, from, to, msg);
    }
    if (err instanceof Error) {
      const cause = err.cause instanceof Error ? `: ${err.cause.message}` : "";
      return { ok: false, reason: "provider", detail: `${err.message}${cause}` };
    }
    return { ok: false, reason: "provider", detail: "Unknown error" };
  }
}

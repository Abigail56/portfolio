// Sends the contact message through Resend's HTTP API. The API key is read on the server only and is
// never sent to the browser. Returns a result instead of throwing, so the route can answer precisely.

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type SendResult = { ok: true; id: string } | { ok: false; reason: "not-configured" | "provider"; detail?: string };

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
        subject: `Portfolio message from ${msg.name}`,
        text: `${msg.message}\n\n---\nFrom: ${msg.name} <${msg.email}>\nSent via the contact form on the portfolio of Chukwu Chinecherem`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok || !data.id) return { ok: false, reason: "provider", detail: data.message ?? `HTTP ${res.status}` };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, reason: "provider", detail: err instanceof Error ? err.message : "Unknown error" };
  }
}

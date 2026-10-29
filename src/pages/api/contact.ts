import type { NextApiRequest, NextApiResponse } from "next";
import { contactSchema, fieldErrorsFrom, type ContactResponse } from "@/lib/contact";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { sendContactEmail } from "@/lib/server/sendEmail";

const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
  return first || req.socket.remoteAddress || "unknown";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ContactResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, reason: "method", error: "Use POST to send a message." });
  }

  const parsed = contactSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    // No visible field is wrong, so only the hidden anti-spam field was filled (usually by browser autofill).
    // Say so instead of pointing at highlighted fields that don't exist.
    const hiddenFieldOnly = Object.keys(fieldErrors).length === 0;
    return res.status(400).json({
      ok: false,
      reason: "validation",
      error: hiddenFieldOnly
        ? "Your browser filled in a hidden anti-spam field, so the message was not sent. Please try again, or email me directly."
        : "Please check the highlighted fields.",
      fieldErrors,
    });
  }

  const limit = checkRateLimit(clientIp(req), LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    return res.status(429).json({ ok: false, reason: "rate-limited", error: "Too many messages in a short time. Please try again later or email me directly." });
  }

  const { name, email, message } = parsed.data;
  const result = await sendContactEmail({ name, email, message });
  if (result.ok) return res.status(200).json({ ok: true });

  if (result.reason === "not-configured") {
    return res.status(503).json({
      ok: false,
      reason: "not-configured",
      error: "The contact form isn't connected to email on this deployment yet, so your message was not sent.",
    });
  }
  console.error("Contact form: email provider error:", result.detail);
  return res.status(502).json({ ok: false, reason: "provider", error: "The email service didn't accept the message, so it was not sent." });
}

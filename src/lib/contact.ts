import { z } from "zod";

// Shared by the contact form (instant feedback) and the API route (the check that actually counts).
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().max(200, "That email address is too long.").pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so I have some context.")
    .max(4000, "Please keep your message under 4,000 characters."),
  // Honeypot: hidden from people, often filled in by bots. Must stay empty.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactFields = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactFields, string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ContactErrors; reason?: "validation" | "not-configured" | "rate-limited" | "provider" | "method" };

export function fieldErrorsFrom(error: z.ZodError): ContactErrors {
  const result: ContactErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if ((field === "name" || field === "email" || field === "message") && !result[field]) {
      result[field] = issue.message;
    }
  }
  return result;
}

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { site } from "@/config/site";
import { contactSchema, fieldErrorsFrom, type ContactErrors, type ContactFields, type ContactResponse } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

const empty = { name: "", email: "", message: "", website: "" };
const MESSAGE_MAX = 4000;

const inputClass =
  "w-full rounded-md border bg-bg px-3 py-2.5 text-[0.9375rem] text-fg placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFields, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  function validate(next = values): ContactErrors {
    const parsed = contactSchema.safeParse(next);
    return parsed.success ? {} : fieldErrorsFrom(parsed.error);
  }

  function update(field: keyof typeof empty, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field has been left, re-check it as the visitor types so the error clears as soon as it's fixed.
    if (field !== "website" && touched[field]) setErrors(validate(next));
  }

  function blur(field: ContactFields) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "sending") return;

    const found = validate();
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (["name", "email", "message"] as const).find((f) => found[f]);
    if (firstInvalid) {
      const target = { name: nameRef, email: emailRef, message: messageRef }[firstInvalid];
      target.current?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await res.json().catch(() => null)) as ContactResponse | null;
      // Success is only shown when the server confirms the email was accepted for delivery.
      if (res.ok && data?.ok) {
        setStatus({ kind: "sent" });
        setValues(empty);
        setTouched({});
      } else {
        if (data && !data.ok && data.fieldErrors) setErrors(data.fieldErrors);
        setStatus({ kind: "failed", message: data && !data.ok ? data.error : `The server responded with an error (${res.status}).` });
      }
    } catch {
      setStatus({ kind: "failed", message: "The message couldn't reach the server. Check your connection and try again." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-xl border border-success/40 bg-success-soft p-6 outline-none">
        <CheckCircle2 aria-hidden className="size-6 text-success" />
        <h3 className="mt-3 text-lg font-semibold text-fg">Message sent</h3>
        <p className="mt-1 text-muted">Thank you. It has been delivered to my inbox, and I&apos;ll reply to the email address you gave.</p>
        <Button variant="secondary" size="sm" className="mt-5" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  const field = (name: ContactFields) => ({
    "aria-invalid": Boolean(touched[name] && errors[name]),
    "aria-describedby": touched[name] && errors[name] ? `${name}-error` : undefined,
    className: cn(inputClass, touched[name] && errors[name] ? "border-danger" : "border-line-strong"),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <div ref={statusRef} tabIndex={-1} className="outline-none" aria-live="assertive">
        {status.kind === "failed" && (
          <div role="alert" className="flex gap-3 rounded-lg border border-danger/40 bg-danger-soft p-4 text-sm">
            <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
            <div>
              <p className="font-medium text-fg">{status.message}</p>
              <p className="mt-1 text-muted">
                Your text is still in the form. You can also email me directly at{" "}
                <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Hello from your portfolio")}`} className="font-medium text-accent underline">
                  {site.contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-fg">
            Name
          </label>
          <input
            ref={nameRef}
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            {...field("name")}
          />
          {touched.name && errors.name && (
            <p id="name-error" className="mt-1.5 text-sm text-danger">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-fg">
            Email
          </label>
          <input
            ref={emailRef}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
            {...field("email")}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="contact-message" className="block text-sm font-medium text-fg">
            Message
          </label>
          <span className="font-mono text-xs text-subtle" aria-hidden>
            {values.message.length}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          ref={messageRef}
          id="contact-message"
          name="message"
          rows={6}
          required
          maxLength={MESSAGE_MAX}
          placeholder="What are you working on, and how can I help?"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          {...field("message")}
        />
        {touched.message && errors.message && (
          <p id="message-error" className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot for bots: hidden from people and from assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-sm text-subtle">I only use your details to reply to you.</p>
      </div>
    </form>
  );
}

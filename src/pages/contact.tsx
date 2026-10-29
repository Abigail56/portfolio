import Link from "next/link";
import type { ReactNode } from "react";
import { Download, FileText, Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/contact/CopyButton";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Container, PageHeader } from "@/components/ui/Section";
import { site } from "@/config/site";

interface Channel {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
  copy?: string;
}

const channels: Channel[] = [
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, icon: <Mail className="size-5" />, copy: site.contact.email },
  { label: "Phone", value: site.contact.phoneDisplay, href: site.contact.phoneHref, icon: <Phone className="size-5" />, copy: site.contact.phoneDisplay },
  {
    label: "LinkedIn",
    value: site.links.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
    href: site.links.linkedin,
    icon: <LinkedInIcon className="size-5" />,
    external: true,
  },
  { label: "GitHub", value: site.links.github.replace(/^https:\/\//, ""), href: site.links.github, icon: <GitHubIcon className="size-5" />, external: true },
];

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact" description={`Contact ${site.person.name} by email, phone, LinkedIn or the contact form.`} />
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        lead={
          site.openToOpportunities
            ? "I'm open to software engineering roles. Email is the quickest way to reach me; the form sends to the same inbox."
            : "Email is the quickest way to reach me; the form sends to the same inbox."
        }
      />
      <Container className="mt-14">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12">
          <div className="grid h-fit grid-cols-[minmax(0,1fr)] gap-3">
            {channels.map((c) => (
              <div
                key={c.label}
                className="group relative flex items-center gap-4 rounded-xl card p-4 shadow-sm transition-[border-color,box-shadow] hover:border-accent-line hover:shadow-md"
              >
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  {c.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-subtle">{c.label}</span>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="relative block truncate font-medium text-fg after:absolute after:inset-0 after:content-['']"
                  >
                    {c.value}
                    {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </span>
                {c.copy && <CopyButton value={c.copy} label={`Copy ${c.label.toLowerCase()}`} />}
              </div>
            ))}

            <div className="rounded-xl card p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <FileText className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-subtle">CV</span>
                  <span className="block font-medium text-fg">Read online or download</span>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pl-[3.75rem]">
                <Link href={site.cv.viewHref} className="inline-flex h-8 items-center rounded-md border border-line-strong px-3 text-sm font-medium text-fg hover:bg-surface-2">
                  View CV
                </Link>
                <a
                  href={site.cv.href}
                  download={site.cv.fileName}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent-solid px-3 text-sm font-medium text-on-accent hover:bg-accent-solid-hover"
                >
                  <Download aria-hidden className="size-3.5" />
                  Download PDF
                </a>
              </div>
            </div>

            <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
              <MapPin aria-hidden className="size-4 text-accent" />
              {site.person.location} · {site.person.timezone}
            </p>
          </div>

          <section aria-labelledby="form-title" data-reveal className="h-fit rounded-2xl card p-6 shadow-md sm:p-8">
            <h2 id="form-title" className="text-xl font-semibold text-fg">
              Send a message
            </h2>
            <p className="mt-1 mb-7 text-sm text-muted">All fields are required.</p>
            <ContactForm />
          </section>
        </div>
      </Container>
    </>
  );
}

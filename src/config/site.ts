// Identity, links and navigation in one place. Change the brand or a link here and it updates everywhere:
// header, footer, metadata, the contact page and the developer terminal.

export const site = {
  brand: "Chukwu Chinecherem",
  /**
   * The public address (no trailing slash): a custom domain if one is configured, otherwise the free address of the
   * host it's deployed on (see next.config.ts). When neither is known, pages leave out canonical links instead of guessing.
   */
  url: process.env.SITE_URL || null,
  description:
    "Chukwu Chinecherem is a full-stack software engineer in Port Harcourt, Nigeria, building with React, Next.js, TypeScript, Python, FastAPI and PostgreSQL.",
  person: {
    name: "Chukwu Chinecherem",
    firstName: "Chinecherem",
    role: "Full-Stack Software Engineer",
    location: "Port Harcourt, Nigeria",
    timezone: "WAT (UTC+1)",
  },
  // Set to false to hide the availability indicator in the navigation and on the contact page.
  openToOpportunities: true,
  contact: {
    email: "chinecheremchukwu15@gmail.com",
    phoneDisplay: "+234 906 046 1720",
    phoneHref: "tel:+2349060461720",
  },
  links: {
    github: "https://github.com/Abigail56",
    linkedin: "https://www.linkedin.com/in/necherem-chukwu/",
  },
  // Portrait shown on the home and About pages. Put the photo in public/images/ and set `src`;
  // while `src` is null a monogram is shown instead. A 4:5 portrait of at least 800×1000 px works best.
  photo: {
    src: "/images/profile.jpg" as string | null,
    alt: "Portrait of Chukwu Chinecherem",
  },
  cv: {
    /** The page where the CV can be read in the browser. */
    viewHref: "/cv",
    /** The PDF itself, for downloading. */
    href: "/cv/Chinecherem-Chukwu-CV.pdf",
    fileName: "Chinecherem-Chukwu-CV.pdf",
    sizeLabel: "PDF · 2 pages",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Interactive Lab", href: "/playground" },
  { label: "Contact", href: "/contact" },
];

/** Secondary pages, linked from the footer only. */
export const footerExtras: NavItem[] = [{ label: "Engineering notes", href: "/engineering" }];

import type { SkillGroup, TimelineEntry } from "@/lib/types";

// About-page copy. Written from my CV; edit freely, it is rendered paragraph by paragraph.
export const aboutParagraphs: string[] = [
  "I'm a full-stack software engineer in Port Harcourt, currently training with the Africa Plan Foundation. I build complete products: the database schema, the API around it, and the interface people use, and I care that they're secure, maintainable and work well on any screen.",
  "Before software, I studied Building Technology at ESUT and worked in construction site management, which taught me to plan carefully and document clearly. I bring the same habits to code: define the rules first, test them, and leave the work easy for the next person to change.",
];

/** Each principle points at a place in my own code where it shows. */
export const principles: { title: string; detail: string; evidence: { text: string; href: string } }[] = [
  {
    title: "Start with the rules",
    detail: "Before the interface, I define the states, permissions and failure cases. They are what users rely on.",
    evidence: { text: "In RouteBridge, one transition table governs every delivery status change.", href: "/projects/routebridge" },
  },
  {
    title: "Make failure visible",
    detail: "Specific errors, no silent fallbacks, and no success message unless something actually succeeded.",
    evidence: { text: "In VotingUI, each rejected ballot gets its own status: 400, 403 or 409.", href: "/projects/votingui-nextjs" },
  },
  {
    title: "Leave it explainable",
    detail: "READMEs, decision records and clear names, so the code can be maintained by someone who didn't write it.",
    evidence: { text: "RouteBridge has architecture decision records for its three riskiest parts.", href: "/projects/routebridge" },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend Development",
    summary: "Interfaces built from typed components, with responsive layouts and server state handled properly.",
    skills: [
      { name: "React", projects: ["routebridge", "voxplay", "votingui-nextjs", "iotc-landing-page"] },
      { name: "Next.js", projects: ["routebridge", "voxplay", "votingui-nextjs", "iotc-landing-page"] },
      { name: "TypeScript", projects: ["routebridge", "voxplay", "votingui-nextjs", "votingui-dom"] },
      { name: "JavaScript", projects: ["bean-brew"] },
      { name: "HTML", projects: ["bean-brew", "votingui-dom"] },
      { name: "CSS", projects: ["routebridge", "voxplay"] },
      { name: "Tailwind CSS", projects: ["iotc-landing-page", "votingui-nextjs", "bean-brew"] },
      { name: "DaisyUI", projects: ["iotc-landing-page"] },
      { name: "TanStack Query", projects: ["votingui-nextjs"] },
      { name: "Zustand", projects: ["voxplay"] },
      { name: "Zod", projects: ["iotc-landing-page"] },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    summary: "REST APIs with explicit contracts, real-time updates, and access control at every route.",
    skills: [
      { name: "Python", projects: ["routebridge", "voxplay"] },
      { name: "FastAPI", projects: ["routebridge", "voxplay"] },
      { name: "REST APIs", projects: ["routebridge", "voxplay", "votingui-nextjs"] },
      { name: "Pydantic", projects: ["routebridge", "voxplay"] },
      { name: "Authentication (Argon2, OAuth, JWT)", projects: ["routebridge", "voxplay"] },
      { name: "Role-based access control", projects: ["routebridge"] },
      { name: "WebSockets & server-sent events", projects: ["voxplay", "routebridge"] },
    ],
  },
  {
    id: "database",
    label: "Databases & Data Management",
    summary: "Relational models that enforce the business rules, with migrations and caching around them.",
    skills: [
      { name: "PostgreSQL", projects: ["routebridge", "voxplay"] },
      { name: "SQLModel", projects: ["routebridge", "voxplay"] },
      { name: "SQLAlchemy", projects: ["voxplay"] },
      { name: "Relational data modelling", projects: ["routebridge"] },
      { name: "Alembic migrations" },
      { name: "Redis", projects: ["routebridge", "voxplay"] },
      { name: "pgvector", projects: ["voxplay"] },
      { name: "SQL" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Workflow",
    summary: "Version control, containers and the environment I build in every day.",
    skills: [
      { name: "Git & GitHub" },
      { name: "Docker & Docker Compose", projects: ["routebridge", "voxplay"] },
      { name: "Linux" },
      { name: "VS Code" },
    ],
  },
  {
    id: "testing",
    label: "Testing & Deployment",
    summary: "Automated tests at the unit, integration and browser level, and the hosts my live projects run on.",
    skills: [
      { name: "Pytest", projects: ["routebridge", "voxplay"] },
      { name: "Vitest", projects: ["routebridge"] },
      { name: "Playwright", projects: ["routebridge"] },
      { name: "Vercel", projects: ["votingui-nextjs", "iotc-landing-page"] },
      { name: "Render", projects: ["routebridge"] },
    ],
  },
];

export const timeline: TimelineEntry[] = [
  {
    kind: "training",
    title: "Software Engineering Trainee",
    organisation: "Africa Plan Foundation (APF)",
    period: "Ongoing",
    points: [
      "Frontend development with React, Next.js, TypeScript and modern CSS frameworks",
      "Backend development with Python, FastAPI, relational databases and RESTful APIs",
      "Collaborative development, version control, debugging and project-based work",
      "Authentication, database design, testing, containerisation and deployment",
    ],
  },
  {
    kind: "employment",
    title: "Mathematics Teacher & Head of Corps Members",
    organisation: "National Youth Service Corps (NYSC)",
    location: "Akwa Ibom, Nigeria",
    period: "Nov 2022 – Nov 2023",
    points: [
      "Taught structured Mathematics lessons to build students' understanding and problem-solving",
      "Served as Head of Corps Members, coordinating activities and collaboration among corps members",
    ],
  },
  {
    kind: "employment",
    title: "Site Management",
    organisation: "Astroy Construction Company",
    location: "Imo State, Nigeria",
    period: "May 2019 – Dec 2021",
    points: [
      "Supported construction project coordination, building design reviews and preparation of Bills of Quantities (BOQs)",
      "Assisted with project planning and technical documentation",
      "Worked with colleagues to resolve project challenges",
    ],
  },
  {
    kind: "education",
    title: "Bachelor's Degree in Building Technology",
    organisation: "Enugu State University of Science and Technology (ESUT)",
    period: "2016 – 2021",
    points: [],
  },
];

export const languages = [
  { name: "English", level: "Proficient" },
  { name: "Igbo", level: "Native" },
];

/** The short introduction in the home page's About section. Every fact comes from my CV. */
export const aboutSummary: string[] = [
  "I'm interested in how thoughtful interfaces and reliable backend systems come together to solve practical problems. My work spans responsive frontends, API design, data modelling and real-time features, with security and maintainability treated as part of the product rather than an afterthought.",
  "I'm training as a software engineer with the Africa Plan Foundation. Before software, I studied Building Technology and worked in construction site management, where I learnt to plan carefully and document clearly. I value clear reasoning, maintainable code, and understanding how a system behaves when real people use it.",
];

export const aboutFacts: { label: string; value: string }[] = [
  { label: "Based in", value: "Port Harcourt, Nigeria (WAT, UTC+1)" },
  { label: "Currently", value: "Software Engineering Trainee, Africa Plan Foundation" },
  { label: "Background", value: "Bachelor's in Building Technology, ESUT" },
  { label: "Works across", value: "Next.js, TypeScript, Python, FastAPI, PostgreSQL" },
];

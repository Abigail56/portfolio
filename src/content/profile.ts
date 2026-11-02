import type { SkillGroup, TimelineEntry } from "@/lib/types";

// About-page copy. Written from my CV; edit freely, it is rendered paragraph by paragraph.
export const aboutParagraphs: string[] = [
  "I'm a software engineer with an academic background in Building Technology and a passion for developing practical digital solutions.",
  "My interests span frontend engineering, backend development, API design, database architecture, and building reliable software products.",
  "I enjoy approaching problems analytically, exploring new technologies, and turning ideas into functional applications through continuous learning and hands-on development.",
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
    summary: "Typed, responsive interfaces.",
    skills: [
      { name: "React", projects: ["routebridge", "fleetpulse", "voxplay"] },
      { name: "Next.js", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "TypeScript", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "JavaScript", projects: ["bean-brew"] },
      { name: "Tailwind CSS", projects: ["fleetpulse", "echovault-nexus", "ghostwork", "votingui-nextjs"] },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    summary: "APIs with explicit contracts.",
    skills: [
      { name: "Python", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "FastAPI", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "REST API Development", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork"] },
      { name: "SQLModel", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "SQLAlchemy", projects: ["echovault-nexus", "ghostwork", "voxplay"] },
    ],
  },
  {
    id: "database",
    label: "Databases",
    summary: "Relational models and caching.",
    skills: [
      { name: "PostgreSQL", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "Redis", projects: ["routebridge", "fleetpulse", "ghostwork", "voxplay"] },
    ],
  },
  {
    id: "tools",
    label: "Tools and Engineering",
    summary: "How the work is built and checked.",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "Docker", projects: ["routebridge", "fleetpulse", "ghostwork", "voxplay"] },
      { name: "Linux" },
      { name: "Alembic", projects: ["fleetpulse", "echovault-nexus", "ghostwork"] },
      { name: "Pytest", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
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
    title: "Mathematics Teacher",
    organisation: "National Youth Service Corps (NYSC)",
    location: "Akwa Ibom, Nigeria",
    period: "Nov 2022 – Nov 2023",
    points: [
      "Taught structured Mathematics lessons to build students' understanding and problem-solving",
    ],
  },
  {
    kind: "leadership",
    title: "Head of Corps Members",
    organisation: "National Youth Service Corps (NYSC)",
    location: "Akwa Ibom, Nigeria",
    period: "Nov 2022 – Nov 2023",
    points: ["Coordinated activities and supported collaboration among fellow corps members"],
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

export const aboutFacts: { label: string; value: string }[] = [
  { label: "Based in", value: "Port Harcourt, Nigeria (WAT, UTC+1)" },
  { label: "Currently", value: "Software Engineering Trainee, Africa Plan Foundation" },
  { label: "Background", value: "Bachelor's in Building Technology, ESUT" },
  ];

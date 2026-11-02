import type { SkillGroup, TimelineEntry } from "@/lib/types";

// About-page copy. Written from my CV; edit freely, it is rendered paragraph by paragraph.
export const aboutParagraphs: string[] = [
  "I'm a junior full-stack developer in Port Harcourt, Nigeria. I've built my engineering experience through independent projects, technical training with the Africa Plan Foundation, and continuous learning.",
  "My work covers responsive frontends, backend APIs, database design, and authentication and authorization. On each project I start with the rules a system has to enforce, then build the data model, the API and the interface around them.",
  "Before software, I studied Building Technology and worked in construction site management, where I learned to plan carefully, document clearly and solve problems methodically. I bring those habits to the software I build, and I'm still learning with every project.",
];

/** What I work on, shown beside the About text. */
export const focusAreas: string[] = [
  "Full-stack web development",
  "Frontend development",
  "Backend API development",
  "Database design and management",
  "Authentication and authorization",
  "Software architecture",
  "Problem-solving",
  "Continuous learning",
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
    label: "Frontend",
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
    label: "Backend",
    summary: "APIs with explicit contracts.",
    skills: [
      { name: "Python", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "FastAPI", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "RESTful APIs", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork"] },
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
      { name: "Alembic", projects: ["fleetpulse", "echovault-nexus", "ghostwork"] },
      { name: "Pytest", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork", "voxplay"] },
      { name: "Automated Testing", projects: ["routebridge", "fleetpulse", "echovault-nexus", "ghostwork"] },
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
      "Developing practical software engineering skills through structured technical training and hands-on projects",
      "Building full-stack applications using React, Next.js, TypeScript, Python and FastAPI",
      "Practising RESTful API development, database design, authentication, testing and application security",
      "Using Git and GitHub for version control and collaborative software development",
    ],
  },
  {
    kind: "employment",
    title: "Mathematics Teacher",
    organisation: "National Youth Service Corps (NYSC)",
    location: "Akwa Ibom, Nigeria",
    period: "Nov 2022 – Nov 2023",
    points: ["Delivered Mathematics lessons, simplifying technical concepts and developing students' problem-solving abilities"],
  },
  {
    kind: "employment",
    title: "Site Management",
    organisation: "Astroy Construction Company",
    location: "Imo State, Nigeria",
    period: "May 2019 – Dec 2021",
    points: [
      "Supported construction project coordination, building design reviews and preparation of Bills of Quantities (BOQs)",
      "Assisted with project planning and technical documentation, applying analytical thinking and attention to detail",
      "Collaborated with colleagues to resolve project challenges and support operational objectives",
    ],
  },
  {
    kind: "leadership",
    title: "Head of Corps Members",
    organisation: "National Youth Service Corps (NYSC)",
    location: "Akwa Ibom, Nigeria",
    period: "Nov 2022 – Nov 2023",
    points: [
      "Coordinated fellow corps members, demonstrating communication, teamwork and organisational skills",
      "Supported team coordination and administrative responsibilities",
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

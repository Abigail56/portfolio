/** "live": a public demo that responds. "not-deployed": runs locally only. "planned": designed, not started. */
export type ProjectStatus = "live" | "not-deployed" | "in-development" | "planned";
export type ProjectCategory = "full-stack" | "frontend";
/** "product": something I designed as a product. "learning": built while learning a specific skill. */
export type ProjectKind = "product" | "learning";

export interface ArchitectureNode {
  label: string;
  detail: string;
}

export interface ArchitectureLayer {
  label: string;
  nodes: ArchitectureNode[];
}

export interface Architecture {
  caption: string;
  layers: ArchitectureLayer[];
}

export interface CodeSnippet {
  title: string;
  language: "python" | "typescript" | "html";
  /** Path of the file in the project's repository. */
  source: string;
  code: string;
  note?: string;
}

export interface Note {
  title: string;
  detail: string;
}

export interface Screenshot {
  desktop: string;
  mobile?: string;
  alt: string;
  /** Where the capture came from, shown as a caption so visitors know it is real. */
  capturedFrom: string;
  /** Background behind the screenshot, matching the product's own look (VoxPlay is dark purple). */
  backdrop?: string;
}

/** A short, factual highlight shown on the home page: a title and one sentence. */
export interface Highlight {
  title: string;
  detail: string;
}

/** One engineering topic in the "Under the hood" part of a case study. */
export interface EngineeringNote {
  title: string;
  detail: string;
  points?: string[];
}

/**
 * A lifecycle drawn as a main path plus the transitions that leave it. Must mirror the real code
 * (for RouteBridge, the ALLOWED_TRANSITIONS table).
 */
export interface Flow {
  title: string;
  caption: string;
  steps: string[];
  branches?: { from: string; to: string[] }[];
  note?: string;
}

export interface CaseStudy {
  problem: string;
  audience: string;
  built: string[];
  howItWorks: string[];
  decisions: Note[];
  challenges: Note[];
  nextSteps: string[];
  /** How the project is tested and kept reliable. Each point should be checkable in the repository. */
  testing?: string[];
  /** Where the project stands today: deployment, what's real and what isn't yet. */
  statusNote?: string;
  /** What building it taught me. */
  lessons?: string[];
  architecture?: Architecture;
  snippet?: CodeSnippet;
  /** Data model, API design, storage and similar topics, each checkable in the repository. */
  engineering?: EngineeringNote[];
  /** Lifecycles worth drawing: delivery states, room states. */
  flows?: Flow[];
  /** What doesn't work yet or hasn't been proven. Different from nextSteps, which is what I'd do about it. */
  limitations?: string[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  kind: ProjectKind;
  status: ProjectStatus;
  period: string;
  /** Decorative identity colour for the project's card and page. Never used for text. */
  accent: string;
  monogram: string;
  featured: boolean;
  links: { live?: string; repo?: string };
  /** Shown when there is no public repository, so the missing link is explained rather than hidden. */
  repoNote?: string;
  screenshot?: Screenshot;
  stack: string[];
  /** The technologies shown on cards, when they differ from the first few entries of `stack`. */
  coreStack?: string[];
  /** Three or four engineering highlights for the home page (featured projects only). */
  highlights?: Highlight[];
  features: string[];
  /** Features designed but not built yet, listed so they're never mistaken for finished work. */
  planned?: string[];
  /** The parts of a product worth naming on its card (VoxPlay's games), each marked built or planned. */
  modules?: { label: string; items: { name: string; detail: string; planned?: boolean }[] };
  contributions: string[];
  caseStudy: CaseStudy;
}

export interface SkillGroup {
  id: string;
  label: string;
  summary: string;
  skills: { name: string; projects?: string[] }[];
}

export type TimelineKind = "training" | "employment" | "education";

export interface TimelineEntry {
  kind: TimelineKind;
  title: string;
  organisation: string;
  location?: string;
  period: string;
  points: string[];
}

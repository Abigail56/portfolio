// The developer terminal's command interpreter.
//
// It is a pure function from an input string to lines of text (plus an optional navigation action).
// It never evaluates code, calls a server or touches the operating system: every answer is read from
// the same content files that render the rest of the site.

import { site } from "@/config/site";
import { projects, statusLabels } from "@/content/projects";
import { skillGroups, timeline } from "@/content/profile";

export type LineTone = "default" | "muted" | "accent" | "success" | "error";

export interface TerminalLine {
  text: string;
  tone?: LineTone;
  href?: string;
}

export type TerminalAction = { type: "navigate"; href: string } | { type: "clear" } | { type: "download"; href: string };

export interface TerminalResult {
  lines: TerminalLine[];
  action?: TerminalAction;
}

interface CommandSpec {
  name: string;
  usage: string;
  description: string;
  run: (args: string[]) => TerminalResult;
}

const pages: Record<string, string> = {
  overview: "/",
  home: "/",
  projects: "/projects",
  engineering: "/engineering",
  playground: "/playground",
  about: "/about",
  contact: "/contact",
};

const line = (text: string, tone?: LineTone, href?: string): TerminalLine => ({ text, tone, href });

const commands: CommandSpec[] = [
  {
    name: "help",
    usage: "help",
    description: "List the available commands",
    run: () => ({
      lines: [
        line("Available commands:", "accent"),
        ...commands.map((c) => line(`  ${c.usage.padEnd(18)} ${c.description}`)),
        line(""),
        line("Tip: Tab completes a command, ↑ and ↓ recall earlier ones.", "muted"),
      ],
    }),
  },
  {
    name: "about",
    usage: "about",
    description: "Who I am",
    run: () => ({
      lines: [
        line(`${site.person.name}, ${site.person.role}`, "accent"),
        line(`Based in ${site.person.location}.`),
        line("I build full-stack products: database schemas, the APIs around them, and the interfaces people use."),
        line("Currently a software engineering trainee with the Africa Plan Foundation."),
        line(site.openToOpportunities ? "Status: open to opportunities." : "", "success"),
      ].filter((l) => l.text !== ""),
    }),
  },
  {
    name: "projects",
    usage: "projects",
    description: "List my projects",
    run: () => ({
      lines: [
        ...projects.map((p) => line(`  ${p.slug.padEnd(20)} ${p.name} · ${statusLabels[p.status]}`)),
        line(""),
        line("Type 'project <name>' for details, e.g. project routebridge", "muted"),
      ],
    }),
  },
  {
    name: "project",
    usage: "project <name>",
    description: "Details of one project",
    run: (args) => {
      const query = args.join(" ").toLowerCase();
      if (!query) return { lines: [line("Usage: project <name>. Type 'projects' to see the names.", "error")] };
      const project = projects.find((p) => p.slug === query || p.name.toLowerCase() === query) ?? projects.find((p) => p.slug.startsWith(query));
      if (!project) return { lines: [line(`No project called '${query}'. Type 'projects' to see the list.`, "error")] };
      return {
        lines: [
          line(`${project.name}  [${statusLabels[project.status]}]`, "accent"),
          line(project.summary),
          line(`Stack: ${project.stack.join(", ")}`, "muted"),
          line(`Case study: /projects/${project.slug}`, "default", `/projects/${project.slug}`),
          ...(project.links.live ? [line(`Live: ${project.links.live}`, "default", project.links.live)] : []),
          ...(project.links.repo ? [line(`Source: ${project.links.repo}`, "default", project.links.repo)] : []),
        ],
      };
    },
  },
  {
    name: "skills",
    usage: "skills",
    description: "My engineering toolkit",
    run: () => ({
      lines: skillGroups.flatMap((g) => [line(g.label, "accent"), line(`  ${g.skills.map((s) => s.name).join(" · ")}`)]),
    }),
  },
  {
    name: "experience",
    usage: "experience",
    description: "Training, work and education",
    run: () => ({
      lines: timeline.map((t) => line(`${t.period.padEnd(20)} ${t.title}, ${t.organisation}`)),
    }),
  },
  {
    name: "contact",
    usage: "contact",
    description: "How to reach me",
    run: () => ({
      lines: [
        line(`Email     ${site.contact.email}`, "default", `mailto:${site.contact.email}`),
        line(`Phone     ${site.contact.phoneDisplay}`, "default", site.contact.phoneHref),
        line(`LinkedIn  ${site.links.linkedin}`, "default", site.links.linkedin),
        line(`GitHub    ${site.links.github}`, "default", site.links.github),
      ],
    }),
  },
  {
    name: "cv",
    usage: "cv",
    description: "Download my CV (PDF)",
    run: () => ({
      lines: [line(`Downloading ${site.cv.fileName}…`, "success")],
      action: { type: "download", href: site.cv.href },
    }),
  },
  {
    name: "open",
    usage: "open <page>",
    description: "Go to a page, e.g. open projects",
    run: (args) => {
      const target = (args[0] ?? "").toLowerCase();
      const href = pages[target];
      if (!href) {
        return { lines: [line(`Usage: open <page>. Pages: ${Object.keys(pages).filter((p) => p !== "home").join(", ")}`, "error")] };
      }
      return { lines: [line(`Opening ${href}`, "muted")], action: { type: "navigate", href } };
    },
  },
  {
    name: "clear",
    usage: "clear",
    description: "Clear the screen",
    run: () => ({ lines: [], action: { type: "clear" } }),
  },
];

export const commandNames = commands.map((c) => c.name);

/** Interpret one line of input. Unknown input is reported, never executed. */
export function runCommand(input: string): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [rawName = "", ...args] = trimmed.split(/\s+/);
  const name = rawName.toLowerCase();
  const command = commands.find((c) => c.name === name);
  if (!command) {
    return { lines: [line(`command not found: ${rawName.slice(0, 40)}. Type 'help' to see what I understand.`, "error")] };
  }
  return command.run(args);
}

/** Complete a partially typed command name, or return the input unchanged when it is ambiguous. */
export function completeCommand(input: string): string {
  if (input.includes(" ")) {
    const [cmd, partial = ""] = input.split(/\s+/, 2);
    if (cmd === "project") {
      const matches = projects.map((p) => p.slug).filter((s) => s.startsWith(partial.toLowerCase()));
      return matches.length === 1 ? `project ${matches[0]}` : input;
    }
    if (cmd === "open") {
      const matches = Object.keys(pages).filter((p) => p.startsWith(partial.toLowerCase()));
      return matches.length === 1 ? `open ${matches[0]}` : input;
    }
    return input;
  }
  const matches = commandNames.filter((n) => n.startsWith(input.toLowerCase()));
  return matches.length === 1 ? `${matches[0]} ` : input;
}

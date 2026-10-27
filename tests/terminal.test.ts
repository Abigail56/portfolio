import { describe, expect, it } from "vitest";
import { commandNames, completeCommand, runCommand } from "@/lib/terminal";
import { projects } from "@/content/projects";
import { site } from "@/config/site";

const text = (input: string) => runCommand(input).lines.map((l) => l.text).join("\n");

describe("developer terminal", () => {
  it("lists every command in help", () => {
    const help = text("help");
    for (const name of commandNames) expect(help).toContain(name);
  });

  it("answers from the site's real content", () => {
    expect(text("contact")).toContain(site.contact.email);
    expect(text("contact")).toContain(site.contact.phoneDisplay);
    for (const p of projects) expect(text("projects")).toContain(p.slug);
    expect(text("project routebridge")).toContain("RouteBridge Logistics");
    expect(text("project vox")).toContain("VoxPlay");
  });

  it("is case-insensitive and ignores extra whitespace", () => {
    expect(text("  HELP  ")).toContain("Available commands");
  });

  it("reports unknown input without running it", () => {
    for (const input of ["rm -rf /", "ls", "cat /etc/passwd", "$(whoami)", "<script>alert(1)</script>"]) {
      const result = runCommand(input);
      expect(result.action).toBeUndefined();
      expect(result.lines).toHaveLength(1);
      expect(result.lines[0]?.tone).toBe("error");
      expect(result.lines[0]?.text).toMatch(/^command not found/);
    }
  });

  it("returns actions instead of performing them", () => {
    expect(runCommand("open projects").action).toEqual({ type: "navigate", href: "/projects" });
    expect(runCommand("open nowhere").action).toBeUndefined();
    expect(runCommand("cv").action).toEqual({ type: "download", href: site.cv.href });
    expect(runCommand("clear").action).toEqual({ type: "clear" });
  });

  it("explains missing or unknown project names", () => {
    expect(runCommand("project").lines[0]?.tone).toBe("error");
    expect(runCommand("project nothing-here").lines[0]?.tone).toBe("error");
  });

  it("completes unambiguous input only", () => {
    expect(completeCommand("he")).toBe("help ");
    expect(completeCommand("pro")).toBe("pro"); // project / projects
    expect(completeCommand("project route")).toBe("project routebridge");
    expect(completeCommand("open eng")).toBe("open engineering");
  });
});

import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { engineeringTopics } from "@/content/engineering";
import { skillGroups } from "@/content/profile";
import { site } from "@/config/site";

const slugs = new Set(projects.map((p) => p.slug));
const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("project data", () => {
  it("has unique, URL-safe slugs", () => {
    expect(slugs.size).toBe(projects.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("only uses https links", () => {
    for (const p of projects) {
      for (const url of Object.values(p.links)) if (url) expect(url, p.slug).toMatch(/^https:\/\//);
    }
  });

  it("only marks a project live when it has a live link", () => {
    for (const p of projects) expect(Boolean(p.links.live), p.slug).toBe(p.status === "live");
  });

  it("explains a missing repository", () => {
    for (const p of projects) if (!p.links.repo) expect(p.repoNote, p.slug).toBeTruthy();
  });

  it("references screenshots that exist", () => {
    for (const p of projects) {
      if (!p.screenshot) continue;
      expect(existsSync(publicFile(p.screenshot.desktop)), p.screenshot.desktop).toBe(true);
      if (p.screenshot.mobile) expect(existsSync(publicFile(p.screenshot.mobile)), p.screenshot.mobile).toBe(true);
      expect(p.screenshot.alt.length).toBeGreaterThan(20);
    }
  });

  it("has a complete case study", () => {
    for (const p of projects) {
      expect(p.caseStudy.problem.length, p.slug).toBeGreaterThan(40);
      expect(p.caseStudy.built.length, p.slug).toBeGreaterThan(0);
      expect(p.caseStudy.nextSteps.length, p.slug).toBeGreaterThan(0);
      expect(p.features.length, p.slug).toBeGreaterThan(0);
      expect(p.accent, p.slug).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("cross-references", () => {
  it("every project referenced elsewhere exists", () => {
    const referenced = [
      ...engineeringTopics.flatMap((t) => t.projects),
      ...skillGroups.flatMap((g) => g.skills.flatMap((s) => s.projects ?? [])),
    ];
    for (const slug of referenced) expect(slugs.has(slug), slug).toBe(true);
  });
});

describe("site config", () => {
  it("points at a CV that exists", () => {
    expect(existsSync(publicFile(site.cv.href))).toBe(true);
  });

  it("has a dialable phone link", () => {
    expect(site.contact.phoneHref).toMatch(/^tel:\+\d{10,15}$/);
  });
});

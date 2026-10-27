import type { GetServerSideProps } from "next";
import { games } from "@/content/games";
import { projects } from "@/content/projects";
import { siteOrigin } from "@/lib/server/siteOrigin";

const paths = [
  "/",
  "/projects",
  ...projects.map((p) => `/projects/${p.slug}`),
  "/engineering",
  "/about",
  "/contact",
  "/cv",
  "/playground",
  ...games.map((g) => `/playground/${g.id}`),
];

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const origin = siteOrigin(req);
  const urls = paths.map((p) => `  <url><loc>${origin}${p === "/" ? "" : p}</loc></url>`).join("\n");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  return { props: {} };
};

export default function Sitemap() {
  return null;
}

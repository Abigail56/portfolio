import type { GetServerSideProps } from "next";
import { siteOrigin } from "@/lib/server/siteOrigin";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteOrigin(req)}/sitemap.xml\n`);
  return { props: {} };
};

export default function Robots() {
  return null;
}

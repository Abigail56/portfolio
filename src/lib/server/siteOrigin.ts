import type { IncomingMessage } from "node:http";
import { site } from "@/config/site";

/** The configured production URL, or the address this request came in on (for previews and local runs). */
export function siteOrigin(req: IncomingMessage): string {
  if (site.url) return site.url;
  const proto = String(req.headers["x-forwarded-proto"] ?? "http").split(",")[0];
  return `${proto}://${req.headers.host ?? "localhost:3000"}`;
}

import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// The site's public address, used for canonical links, social previews and the sitemap. A custom domain set in
// NEXT_PUBLIC_SITE_URL wins; without one, the free address the host assigns is used (Vercel and Render both expose
// it at build time). Elsewhere it stays empty and pages leave those links out rather than guess.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "") || process.env.RENDER_EXTERNAL_URL || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { SITE_URL: siteUrl.replace(/\/$/, "") },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

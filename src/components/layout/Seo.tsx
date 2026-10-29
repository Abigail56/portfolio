import Head from "next/head";
import { useRouter } from "next/router";
import { site } from "@/config/site";

interface SeoProps {
  /** Page name; omitted on the home page, which uses the full brand title. */
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  /** Structured data (schema.org JSON-LD) for this page. */
  jsonLd?: Record<string, unknown>;
}

export function Seo({ title, description = site.description, image = "/og.png", noindex, jsonLd }: SeoProps) {
  const { asPath } = useRouter();
  const fullTitle = title ? `${title} · ${site.brand}` : `${site.person.name} · ${site.person.role}`;
  const path = asPath.split(/[?#]/)[0] ?? "/";
  const url = site.url ? `${site.url}${path === "/" ? "" : path}` : null;
  const imageUrl = image.startsWith("http") || !site.url ? image : `${site.url}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.brand} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${site.person.name}, ${site.person.role}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {jsonLd && (
        // "<" is escaped so content can never close the script tag early.
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </Head>
  );
}

import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { Layout } from "@/components/layout/Layout";
import "@/styles/globals.css";

// Self-hosted variable fonts (SIL Open Font License 1.1): no request to a font CDN at build or run time.
const body = localFont({ src: "../fonts/Inter-latin.woff2", variable: "--font-body", display: "swap" });
const code = localFont({ src: "../fonts/JetBrainsMono-latin.woff2", variable: "--font-code", display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${body.variable} ${code.variable} font-sans`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

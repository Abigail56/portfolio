import { Head, Html, Main, NextScript } from "next/document";
import { themeInitScript } from "@/lib/theme";

export default function Document() {
  return (
    <Html lang="en" data-theme="dark" suppressHydrationWarning>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0b1020" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

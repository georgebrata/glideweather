import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MARK_SRC, PRODUCT_NAME, resolveSiteOrigin } from "./brand";
import { getServerDocumentLang } from "./seo/serverLocale";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteOrigin = resolveSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: PRODUCT_NAME,
  icons: {
    icon: MARK_SRC,
    shortcut: MARK_SRC,
    apple: MARK_SRC,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getServerDocumentLang();

  return (
    <html
      lang={lang}
      className={`dark ${inter.variable} ${ibmPlexMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { authEnabled } from "../flags";
import { MARK_SRC, PRODUCT_NAME, resolveSiteOrigin } from "./brand";
import { glideClerkAppearance } from "./lib/clerkAppearance";
import { DEFAULT_LOCALE, getTranslations } from "./i18n";
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

const defaultText = getTranslations(DEFAULT_LOCALE);
const siteOrigin = resolveSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: defaultText.meta.title,
  description: defaultText.meta.description,
  applicationName: PRODUCT_NAME,
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ro: "/",
    },
  },
  icons: {
    icon: MARK_SRC,
    shortcut: MARK_SRC,
    apple: MARK_SRC,
  },
  openGraph: {
    type: "website",
    siteName: PRODUCT_NAME,
    url: siteOrigin,
    title: defaultText.meta.title,
    description: defaultText.meta.description,
    images: [MARK_SRC],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authOn = await authEnabled();

  return (
    <html
      lang={defaultText.meta.documentLang}
      className={`dark ${inter.variable} ${ibmPlexMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="antialiased">
        {authOn ? (
          <ClerkProvider appearance={glideClerkAppearance}>{children}</ClerkProvider>
        ) : (
          children
        )}
        <Analytics />
      </body>
    </html>
  );
}

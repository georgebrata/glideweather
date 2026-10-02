import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MARK_SRC, PRODUCT_NAME, resolveSiteOrigin } from "./brand";
import { DEFAULT_LOCALE, getTranslations } from "./i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultText.meta.documentLang} suppressHydrationWarning>
      <body className={inter.variable}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
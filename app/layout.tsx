import type { Metadata } from "next";
import { MARK_SRC } from "./brand";
import { DEFAULT_LOCALE, getTranslations } from "./i18n";
import "./globals.css";

const defaultText = getTranslations(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: defaultText.meta.title,
  description: defaultText.meta.description,
  icons: {
    icon: MARK_SRC,
    shortcut: MARK_SRC,
    apple: MARK_SRC,
  },
  openGraph: {
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
      <body>{children}</body>
    </html>
  );
}

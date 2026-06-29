import type { Metadata } from "next";
import { DEFAULT_LOCALE, getTranslations } from "./i18n";
import "./globals.css";

const defaultText = getTranslations(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: defaultText.meta.title,
  description: defaultText.meta.description,
  icons: {
    icon: "/parapantabil-logo.png",
    shortcut: "/parapantabil-logo.png",
    apple: "/parapantabil-logo.png",
  },
  openGraph: {
    title: defaultText.meta.title,
    description: defaultText.meta.description,
    images: ["/parapantabil-logo.png"],
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

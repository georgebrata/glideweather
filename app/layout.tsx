import type { Metadata } from "next";
import { MARK_SRC, PAGE_DESCRIPTION, PAGE_TITLE } from "./brand";
import "./globals.css";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  icons: {
    icon: MARK_SRC,
    shortcut: MARK_SRC,
    apple: MARK_SRC,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [MARK_SRC],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

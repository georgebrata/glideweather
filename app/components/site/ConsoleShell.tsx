import Script from "next/script";
import { SkipLink } from "./SkipLink";
import { SiteFooter } from "./SiteFooter";
import type { ContentLocale } from "@/app/seo/types";
import { pathForRoute } from "@/app/seo/routes";

export const ConsoleShell = ({
  locale,
  children,
  intro,
  footer,
}: {
  locale: ContentLocale;
  children: React.ReactNode;
  intro?: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  const currentPath = pathForRoute("home", locale);

  return (
    <>
      <SkipLink locale={locale} />
      <Script
        src="https://cdn.counter.dev/script.js"
        data-id="03bd5925-48e2-4d33-ae59-d66aaf6acba0"
        data-utcoffset="2"
        strategy="afterInteractive"
      />
      {children}
      {intro}
      {footer ?? <SiteFooter locale={locale} currentPath={currentPath} />}
    </>
  );
};

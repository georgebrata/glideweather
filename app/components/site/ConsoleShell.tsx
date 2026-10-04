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
      {children}
      {intro}
      {footer ?? <SiteFooter locale={locale} currentPath={currentPath} />}
    </>
  );
};

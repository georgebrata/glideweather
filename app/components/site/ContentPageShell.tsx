import { SkipLink } from "./SkipLink";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import type { ContentLocale } from "@/app/seo/types";

export const ContentPageShell = ({
  locale,
  currentPath,
  children,
}: {
  locale: ContentLocale;
  currentPath: string;
  children: React.ReactNode;
}) => (
  <div className="nocturne-canvas flex min-h-screen flex-col text-foreground">
    <SkipLink locale={locale} />
    <SiteHeader locale={locale} />
    <main id="main-content" className="flex-1">
      {children}
    </main>
    <SiteFooter locale={locale} currentPath={currentPath} />
  </div>
);

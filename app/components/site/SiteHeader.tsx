import Link from "next/link";
import { PRODUCT_NAME } from "@/app/brand";
import { chromeFor } from "@/app/seo/chrome";
import { pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export const SiteHeader = ({ locale }: { locale: ContentLocale }) => {
  const labels = chromeFor(locale);
  const home = pathForRoute("home", locale);

  return (
    <header className="border-b border-[var(--border-flight)] bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href={home} className="text-lg font-semibold tracking-tight text-foreground">
          {PRODUCT_NAME}
        </Link>
        <nav aria-label={labels.navAria} className="flex flex-wrap gap-4 text-sm">
          <Link href={home} className="text-muted-foreground hover:text-foreground">
            {labels.console}
          </Link>
          <Link href={pathForRoute("about", locale)} className="text-muted-foreground hover:text-foreground">
            {labels.guides}
          </Link>
          <Link
            href={pathForRoute("destinationsHub", locale)}
            className="text-muted-foreground hover:text-foreground"
          >
            {labels.destinations}
          </Link>
        </nav>
      </div>
    </header>
  );
};

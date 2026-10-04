import Link from "next/link";
import { pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";
import { PRODUCT_NAME } from "@/app/brand";

const navLabels: Record<ContentLocale, { console: string; guides: string; destinations: string }> = {
  en: {
    console: "Flight console",
    guides: "Guides",
    destinations: "Destinations",
  },
  ro: {
    console: "Consolă zbor",
    guides: "Ghiduri",
    destinations: "Destinații",
  },
};

export const SiteHeader = ({ locale }: { locale: ContentLocale }) => {
  const labels = navLabels[locale];
  const home = pathForRoute("home", locale);

  return (
    <header className="border-b border-[var(--border-flight)] bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href={home} className="text-lg font-semibold tracking-tight text-foreground">
          {PRODUCT_NAME}
        </Link>
        <nav aria-label={locale === "ro" ? "Navigare principală" : "Primary"} className="flex flex-wrap gap-4 text-sm">
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

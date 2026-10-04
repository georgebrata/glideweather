import Link from "next/link";
import { PRODUCT_NAME } from "@/app/brand";
import { getGuideCopy } from "@/app/content/guides";
import { destinationPath, footerDestinationsForContentLocale, localizedText } from "@/app/content/destinations";
import { CONTENT_LOCALES } from "../../../content-locales";
import { FEEDBACK_PAGE } from "@/app/content/feedback";
import { contentLocaleDefinition } from "../../../content-locales";
import { chromeFor } from "@/app/seo/chrome";
import { alternatePath, GUIDE_ROUTE_KEYS, pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";

export const SiteFooter = ({
  locale,
  currentPath,
}: {
  locale: ContentLocale;
  currentPath: string;
}) => {
  const copy = getGuideCopy(locale);
  const destinations = footerDestinationsForContentLocale(locale);
  const labels = chromeFor(locale);

  return (
    <footer className="border-t border-[var(--border-flight)] bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 md:px-6">
        <nav aria-label={PRODUCT_NAME}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{PRODUCT_NAME}</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {GUIDE_ROUTE_KEYS.map((key) => (
              <li key={key}>
                <Link href={pathForRoute(key, locale)} className="hover:text-foreground">
                  {labels.guideLabels[key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pathForRoute("destinationsHub", locale)} className="hover:text-foreground">
                {labels.allDestinations}
              </Link>
            </li>
            <li>
              <Link href={pathForRoute("feedback", locale)} className="hover:text-foreground">
                {FEEDBACK_PAGE[contentLocaleDefinition(locale).copy].nav}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={labels.popularDestinations}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{labels.popularDestinations}</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {destinations.map((destination) => (
              <li key={destination.id}>
                <Link
                  href={destinationPath(destination.slug, locale)}
                  prefetch={false}
                  className="hover:text-foreground"
                >
                  {localizedText(destination.names, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={labels.language}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{labels.language}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {CONTENT_LOCALES.map((entry) => {
              const href = alternatePath(currentPath, entry.id) ?? pathForRoute("home", entry.id);
              const current = entry.id === locale;
              return (
                <li key={entry.id}>
                  <Link
                    href={href}
                    hrefLang={entry.hreflang}
                    className={current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
                  >
                    {entry.nativeName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="text-sm text-muted-foreground lg:col-span-1">
          <p className="font-medium text-foreground">{PRODUCT_NAME}</p>
          <p className="mt-2">{copy.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
};

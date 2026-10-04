import Link from "next/link";
import { getGuideCopy } from "@/app/content/guides";
import { footerDestinationsForContentLocale } from "@/app/content/destinations";
import { destinationPath } from "@/app/content/destinations";
import { GUIDE_ROUTE_KEYS, pathForRoute, alternatePath } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";
import { PRODUCT_NAME } from "@/app/brand";

const guideLabels: Record<ContentLocale, Record<string, string>> = {
  en: {
    about: "About GlideWeather",
    howItWorks: "How it works",
    paraglidingWeather: "Paragliding weather",
    whenToFly: "When to fly",
    flightWindow: "Flight window",
    faq: "FAQ",
    destinationsHub: "All destinations",
  },
  ro: {
    about: "Despre GlideWeather",
    howItWorks: "Cum funcționează",
    paraglidingWeather: "Meteo parapantă",
    whenToFly: "Când să zbori",
    flightWindow: "Fereastra de zbor",
    faq: "Întrebări frecvente",
    destinationsHub: "Toate destinațiile",
  },
};

const sectionLabels: Record<ContentLocale, { product: string; destinations: string; language: string }> = {
  en: {
    product: PRODUCT_NAME,
    destinations: "Popular paragliding destinations",
    language: "Language",
  },
  ro: {
    product: PRODUCT_NAME,
    destinations: "Destinații populare parapantă",
    language: "Limbă",
  },
};

export const SiteFooter = ({
  locale,
  currentPath,
}: {
  locale: ContentLocale;
  currentPath: string;
}) => {
  const copy = getGuideCopy(locale);
  const destinations = footerDestinationsForContentLocale(locale);
  const labels = sectionLabels[locale];
  const enPath = alternatePath(currentPath, "en") ?? "/";
  const roPath = alternatePath(currentPath, "ro") ?? "/ro";

  return (
    <footer className="border-t border-[var(--border-flight)] bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 md:px-6">
        <nav aria-label={labels.product}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{labels.product}</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {GUIDE_ROUTE_KEYS.map((key) => (
              <li key={key}>
                <Link href={pathForRoute(key, locale)} className="hover:text-foreground">
                  {guideLabels[locale][key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={pathForRoute("destinationsHub", locale)} className="hover:text-foreground">
                {guideLabels[locale].destinationsHub}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={labels.destinations}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{labels.destinations}</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {destinations.map((destination) => (
              <li key={destination.id}>
                <Link
                  href={destinationPath(destination.slug, locale)}
                  prefetch={false}
                  className="hover:text-foreground"
                >
                  {destination.names[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={labels.language}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{labels.language}</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                href={enPath}
                hrefLang="en"
                className={locale === "en" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                English
              </Link>
            </li>
            <li>
              <Link
                href={roPath}
                hrefLang="ro"
                className={locale === "ro" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                Română
              </Link>
            </li>
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

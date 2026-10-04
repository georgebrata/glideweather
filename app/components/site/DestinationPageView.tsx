import Link from "next/link";
import {
  destinationForecastHref,
  destinationPath,
  type DestinationRecord,
  DESTINATIONS,
} from "@/app/content/destinations";
import { getGuideCopy } from "@/app/content/guides";
import { breadcrumbJsonLd, JsonLd, placeJsonLd, webPageJsonLd } from "@/app/seo/jsonld";
import { pathForRoute } from "@/app/seo/routes";
import type { ContentLocale } from "@/app/seo/types";
import { ContentPageShell } from "./ContentPageShell";

export const DestinationPageView = ({
  locale,
  destination,
}: {
  locale: ContentLocale;
  destination: DestinationRecord;
}) => {
  const path = destinationPath(destination.slug, locale);
  const copy = getGuideCopy(locale);
  const hubPath = pathForRoute("destinationsHub", locale);
  const hubLabel = locale === "ro" ? "Destinații" : "Destinations";
  const homePath = pathForRoute("home", locale);
  const related = DESTINATIONS.filter((d) => d.id !== destination.id).slice(0, 4);

  const title = `${destination.names[locale]} paragliding weather`;
  const description = destination.shortDescriptions[locale];

  const jsonLd = [
    webPageJsonLd(locale, path, title, description),
    placeJsonLd(
      locale,
      path,
      destination.names[locale],
      destination.overviews[locale],
      destination.latitude,
      destination.longitude,
      destination.countryCode,
    ),
    breadcrumbJsonLd(locale, [
      { name: locale === "ro" ? "Acasă" : "Home", path: homePath },
      { name: hubLabel, path: hubPath },
      { name: destination.names[locale], path },
    ]),
  ];

  return (
    <ContentPageShell locale={locale} currentPath={path}>
      <JsonLd data={jsonLd} />
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-semibold tracking-tight">
          {destination.names[locale]}
        </h1>
        <p className="mt-2 text-muted-foreground">{destination.areas[locale]}</p>
        <p className="mt-4 text-lg text-muted-foreground">{destination.shortDescriptions[locale]}</p>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">{locale === "ro" ? "Prezentare" : "Overview"}</h2>
          <p className="text-muted-foreground">{destination.overviews[locale]}</p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">
            {locale === "ro" ? "Context de zbor" : "Flying context"}
          </h2>
          <p className="text-muted-foreground">{destination.flyingContext[locale]}</p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">{locale === "ro" ? "Sezonalitate" : "Seasonality"}</h2>
          <p className="text-muted-foreground">{destination.seasonality[locale]}</p>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--border-flight)] bg-card p-6">
          <h2 className="text-lg font-semibold">
            {locale === "ro" ? "Punct de referință prognoză" : "Forecast reference point"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {locale === "ro"
              ? `Coordonate: ${destination.latitude.toFixed(4)}°, ${destination.longitude.toFixed(4)}°. Prognoza se calculează pentru acest punct de grilă, nu pentru fiecare decolare din zonă.`
              : `Coordinates: ${destination.latitude.toFixed(4)}°, ${destination.longitude.toFixed(4)}°. The forecast is computed for this grid point, not every launch in the area.`}
          </p>
          <p className="mt-4">
            <Link
              href={destinationForecastHref(destination.id, locale)}
              className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {locale === "ro" ? "Deschide prognoza în consolă" : "Open forecast in console"}
            </Link>
          </p>
        </section>

        {destination.referenceUrl ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {locale === "ro" ? "Referință externă: " : "External reference: "}
            <a
              href={destination.referenceUrl}
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {destination.referenceUrl}
            </a>
          </p>
        ) : null}

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {locale === "ro" ? "Alte destinații" : "Related destinations"}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {related.map((d) => (
              <li key={d.id}>
                <Link href={destinationPath(d.slug, locale)} className="text-primary hover:underline">
                  {locale === "ro"
                    ? `Meteo parapantă ${d.names[locale]}`
                    : `${d.names[locale]} paragliding weather`}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 border-t border-[var(--border-flight)] pt-6 text-sm text-muted-foreground">
          {copy.disclaimer}
        </p>
      </article>
    </ContentPageShell>
  );
};

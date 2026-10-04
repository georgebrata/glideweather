import Link from "next/link";
import {
  DESTINATIONS,
  destinationForecastHref,
  destinationPath,
  localizedText,
  type DestinationRecord,
} from "@/app/content/destinations";
import { getGuideCopy } from "@/app/content/guides";
import { chromeFor } from "@/app/seo/chrome";
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
  const chrome = chromeFor(locale);
  const hubLabel = chrome.destinations;
  const homePath = pathForRoute("home", locale);
  const name = localizedText(destination.names, locale);
  const sameCountry = DESTINATIONS.filter(
    (item) => item.id !== destination.id && item.countryCode === destination.countryCode,
  );
  const related = (sameCountry.length > 0 ? sameCountry : DESTINATIONS.filter((item) => item.id !== destination.id)).slice(0, 4);

  const title = chrome.destinationLink(name);
  const description = localizedText(destination.shortDescriptions, locale);

  const jsonLd = [
    webPageJsonLd(locale, path, title, description),
    placeJsonLd(
      locale,
      path,
      name,
      localizedText(destination.overviews, locale),
      destination.latitude,
      destination.longitude,
      destination.countryCode,
    ),
    breadcrumbJsonLd(locale, [
      { name: chrome.home, path: homePath },
      { name: hubLabel, path: hubPath },
      { name, path },
    ]),
  ];

  return (
    <ContentPageShell locale={locale} currentPath={path}>
      <JsonLd data={jsonLd} />
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="text-4xl font-semibold tracking-tight">
          {name}
        </h1>
        <p className="mt-2 text-muted-foreground">{localizedText(destination.areas, locale)}</p>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">{chrome.overview}</h2>
          <p className="text-muted-foreground">{localizedText(destination.overviews, locale)}</p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">{chrome.flyingContext}</h2>
          <p className="text-muted-foreground">{localizedText(destination.flyingContext, locale)}</p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">{chrome.seasonality}</h2>
          <p className="text-muted-foreground">{localizedText(destination.seasonality, locale)}</p>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--border-flight)] bg-card p-6">
          <h2 className="text-lg font-semibold">{chrome.referencePoint}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {chrome.coordinates(destination.latitude.toFixed(4), destination.longitude.toFixed(4))}
          </p>
          <p className="mt-4">
            <Link
              href={destinationForecastHref(destination.id, locale)}
              className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {chrome.openForecast}
            </Link>
          </p>
        </section>

        {destination.referenceUrl ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {chrome.externalReference}
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
            {chrome.relatedDestinations}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {related.map((d) => (
              <li key={d.id}>
                <Link href={destinationPath(d.slug, locale)} className="text-primary hover:underline">
                  {chrome.destinationLink(localizedText(d.names, locale))}
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

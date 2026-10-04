import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESTINATIONS, getDestinationBySlug, localizedText } from "@/app/content/destinations";
import { DestinationPageView } from "@/app/components/site/DestinationPageView";
import { DestinationsHubView } from "@/app/components/site/DestinationsHubView";
import { FeedbackPageView } from "@/app/components/site/FeedbackPageView";
import { GuidePageView } from "@/app/components/site/GuidePageView";
import { chromeFor } from "@/app/seo/chrome";
import { buildDestinationMetadata, buildPageMetadata } from "@/app/seo/metadata";
import {
  DYNAMIC_CONTENT_LOCALES,
  destinationDirectory,
  INDEXABLE_STATIC_ROUTES,
  resolveRouteFromPath,
} from "@/app/seo/routes";
import { isContentLocale, type ContentLocale, type GuideRouteKey } from "@/app/seo/types";

type PageProps = {
  params: Promise<{ locale: string; path: string[] }>;
};

function asDynamicLocale(value: string): ContentLocale | null {
  if (!isContentLocale(value)) return null;
  if (!DYNAMIC_CONTENT_LOCALES.some((entry) => entry.id === value)) return null;
  return value;
}

export function generateStaticParams() {
  const params: { locale: string; path: string[] }[] = [];
  for (const entry of DYNAMIC_CONTENT_LOCALES) {
    for (const route of INDEXABLE_STATIC_ROUTES) {
      if (route.key === "home") continue;
      const parts = route.paths[entry.id].split("/").filter(Boolean).slice(1);
      if (parts.length === 0) continue;
      params.push({ locale: entry.id, path: parts });
    }
    for (const destination of DESTINATIONS) {
      const parts = `${destinationDirectory(entry.id)}/${destination.slug}`.split("/").filter(Boolean).slice(1);
      params.push({ locale: entry.id, path: parts });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, path } = await params;
  const contentLocale = asDynamicLocale(locale);
  if (!contentLocale) return {};
  const resolved = resolveRouteFromPath(`/${locale}/${path.join("/")}`);
  if (!resolved || resolved.locale !== contentLocale || resolved.key === "home" || resolved.key === "notFound") {
    return {};
  }
  if (resolved.key === "destination") {
    const slug = path[path.length - 1] ?? "";
    const destination = getDestinationBySlug(slug);
    if (!destination) return {};
    const chrome = chromeFor(contentLocale);
    const name = localizedText(destination.names, contentLocale);
    return buildDestinationMetadata(
      contentLocale,
      slug,
      `${chrome.destinationLink(name)} | GlideWeather`,
      localizedText(destination.shortDescriptions, contentLocale),
    );
  }
  return buildPageMetadata(resolved.key, contentLocale);
}

export default async function LocalizedContentPage({ params }: PageProps) {
  const { locale, path } = await params;
  const contentLocale = asDynamicLocale(locale);
  if (!contentLocale) notFound();
  const resolved = resolveRouteFromPath(`/${locale}/${path.join("/")}`);
  if (!resolved || resolved.locale !== contentLocale || resolved.key === "home" || resolved.key === "notFound") {
    notFound();
  }
  if (resolved.key === "destination") {
    const destination = getDestinationBySlug(path[path.length - 1] ?? "");
    if (!destination) notFound();
    return <DestinationPageView locale={contentLocale} destination={destination} />;
  }
  if (resolved.key === "destinationsHub") {
    return <DestinationsHubView locale={contentLocale} />;
  }
  if (resolved.key === "feedback") {
    return <FeedbackPageView locale={contentLocale} />;
  }
  return <GuidePageView locale={contentLocale} routeKey={resolved.key} />;
}

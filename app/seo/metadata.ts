import type { Metadata } from "next";
import { MARK_SRC, PRODUCT_NAME, resolveSiteOrigin } from "../brand";
import { CONTENT_LOCALES } from "../../content-locales";
import { hreflangCode, openGraphLocale } from "./locale";
import { destinationDirectory, getRoute, pathForRoute, type RouteDefinition } from "./routes";
import type { ContentLocale, StaticRouteKey } from "./types";

const siteOrigin = resolveSiteOrigin();

export type PageMetadataOptions = {
  indexable?: boolean;
  canonicalPath?: string;
};

export function buildAlternates(route: RouteDefinition, _locale: ContentLocale, canonicalPath: string) {
  const languages: Record<string, string> = {
    "x-default": route.paths.en,
  };
  for (const entry of CONTENT_LOCALES) {
    languages[hreflangCode(entry.id)] = route.paths[entry.id];
  }
  return {
    canonical: canonicalPath,
    languages,
  };
}

export function buildPageMetadata(
  routeKey: StaticRouteKey,
  locale: ContentLocale,
  options: PageMetadataOptions = {},
): Metadata {
  const route = getRoute(routeKey);
  const canonicalPath = options.canonicalPath ?? route.paths[locale];
  const indexable = options.indexable ?? route.indexable;
  const title = route.titles[locale];
  const description = route.descriptions[locale];
  const url = new URL(canonicalPath, siteOrigin).toString();

  return {
    metadataBase: new URL(siteOrigin),
    title,
    description,
    applicationName: PRODUCT_NAME,
    alternates: buildAlternates(route, locale, canonicalPath),
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    icons: {
      icon: MARK_SRC,
      shortcut: MARK_SRC,
      apple: MARK_SRC,
    },
    openGraph: {
      type: "website",
      siteName: PRODUCT_NAME,
      locale: openGraphLocale(locale),
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildDestinationMetadata(
  locale: ContentLocale,
  slug: string,
  title: string,
  description: string,
): Metadata {
  const canonicalPath = `${destinationDirectory(locale)}/${slug}`;
  const languages: Record<string, string> = {
    "x-default": `${destinationDirectory("en")}/${slug}`,
  };
  for (const entry of CONTENT_LOCALES) {
    languages[hreflangCode(entry.id)] = `${destinationDirectory(entry.id)}/${slug}`;
  }

  return {
    metadataBase: new URL(siteOrigin),
    title,
    description,
    applicationName: PRODUCT_NAME,
    alternates: { canonical: canonicalPath, languages },
    robots: { index: true, follow: true },
    icons: {
      icon: MARK_SRC,
      shortcut: MARK_SRC,
      apple: MARK_SRC,
    },
    openGraph: {
      type: "website",
      siteName: PRODUCT_NAME,
      locale: openGraphLocale(locale),
      url: new URL(canonicalPath, siteOrigin).toString(),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function homeMetadata(locale: ContentLocale, searchParams?: { site?: string }): Metadata {
  const routeKey = "home";
  if (!searchParams?.site) {
    return buildPageMetadata(routeKey, locale);
  }
  const homePath = pathForRoute(routeKey, locale);
  return buildPageMetadata(routeKey, locale, {
    indexable: false,
    canonicalPath: homePath,
  });
}

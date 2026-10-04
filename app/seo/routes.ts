import {
  CONTENT_LOCALES,
  contentLocaleDefinition,
  localeHomePath,
  type ContentLocale,
} from "../../content-locales";
import { FEEDBACK_SEO, FEEDBACK_SLUGS } from "../content/feedback";
import { ROUTE_SEO, ROUTE_SLUGS, type RouteSlugKey } from "./routeCopy";
import type { GuideRouteKey, StaticRouteKey } from "./types";

export type RouteDefinition = {
  key: StaticRouteKey;
  paths: Record<ContentLocale, string>;
  indexable: boolean;
  titles: Record<ContentLocale, string>;
  descriptions: Record<ContentLocale, string>;
};

const GUIDE_KEYS: RouteSlugKey[] = [
  "about",
  "howItWorks",
  "paraglidingWeather",
  "whenToFly",
  "flightWindow",
  "faq",
  "destinationsHub",
];

function localizedPath(locale: ContentLocale, slug: string): string {
  const prefix = contentLocaleDefinition(locale).prefix;
  return prefix ? `/${prefix}/${slug}` : `/${slug}`;
}

function fieldFor(
  key: GuideRouteKey,
  pick: "title" | "description",
): Record<ContentLocale, string> {
  return Object.fromEntries(
    CONTENT_LOCALES.map((entry) => {
      const seo = ROUTE_SEO[entry.copy][key];
      const value = pick === "title" ? seo.title : seo.description;
      if (pick === "title" && entry.titleSuffix) {
        return [entry.id, `${value} | ${entry.titleSuffix}`];
      }
      if (pick === "description" && entry.descriptionLead) {
        return [entry.id, `${entry.descriptionLead}${value}`];
      }
      return [entry.id, value];
    }),
  ) as Record<ContentLocale, string>;
}

function pathsFor(key: GuideRouteKey): Record<ContentLocale, string> {
  return Object.fromEntries(
    CONTENT_LOCALES.map((entry) => {
      if (key === "home") return [entry.id, localeHomePath(entry.id)];
      const slug = ROUTE_SLUGS[entry.copy][key];
      return [entry.id, localizedPath(entry.id, slug)];
    }),
  ) as Record<ContentLocale, string>;
}

function feedbackRoute(): RouteDefinition {
  return {
    key: "feedback",
    indexable: true,
    paths: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => [
        entry.id,
        localizedPath(entry.id, FEEDBACK_SLUGS[entry.copy]),
      ]),
    ) as Record<ContentLocale, string>,
    titles: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => {
        const title = FEEDBACK_SEO[entry.copy].title;
        return [entry.id, entry.titleSuffix ? `${title} | ${entry.titleSuffix}` : title];
      }),
    ) as Record<ContentLocale, string>,
    descriptions: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => {
        const description = FEEDBACK_SEO[entry.copy].description;
        return [entry.id, entry.descriptionLead ? `${entry.descriptionLead}${description}` : description];
      }),
    ) as Record<ContentLocale, string>,
  };
}

function defineRoute(key: GuideRouteKey, indexable = true): RouteDefinition {
  return {
    key,
    paths: pathsFor(key),
    indexable,
    titles: fieldFor(key, "title"),
    descriptions: fieldFor(key, "description"),
  };
}

export const STATIC_ROUTES: RouteDefinition[] = [
  defineRoute("home"),
  ...GUIDE_KEYS.map((key) => defineRoute(key)),
  feedbackRoute(),
  {
    key: "notFound",
    paths: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => [entry.id, localizedPath(entry.id, "404")]),
    ) as Record<ContentLocale, string>,
    indexable: false,
    titles: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => [entry.id, "GlideWeather"]),
    ) as Record<ContentLocale, string>,
    descriptions: Object.fromEntries(
      CONTENT_LOCALES.map((entry) => [entry.id, ROUTE_SEO[entry.copy].home.description]),
    ) as Record<ContentLocale, string>,
  },
];

const routesByKey = new Map(STATIC_ROUTES.map((entry) => [entry.key, entry]));

const pathIndex = new Map<string, { key: StaticRouteKey; locale: ContentLocale }>();
for (const entry of STATIC_ROUTES) {
  for (const locale of CONTENT_LOCALES) {
    pathIndex.set(entry.paths[locale.id], { key: entry.key, locale: locale.id });
  }
}

export function getRoute(key: StaticRouteKey): RouteDefinition {
  const routeDef = routesByKey.get(key);
  if (!routeDef) {
    throw new Error(`Unknown route key: ${key}`);
  }
  return routeDef;
}

export function getGuideRoute(key: GuideRouteKey): RouteDefinition {
  return getRoute(key);
}

export function pathForRoute(key: StaticRouteKey, locale: ContentLocale): string {
  return getRoute(key).paths[locale];
}

export function destinationDirectory(locale: ContentLocale): string {
  return pathForRoute("destinationsHub", locale);
}

export function resolveRouteFromPath(pathname: string): {
  key: StaticRouteKey | "destination";
  locale: ContentLocale;
} | null {
  const normalized = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const exact = pathIndex.get(normalized);
  if (exact) return exact;

  for (const entry of CONTENT_LOCALES) {
    const directory = destinationDirectory(entry.id);
    const prefix = `${directory}/`;
    if (normalized.startsWith(prefix) && !normalized.slice(prefix.length).includes("/")) {
      return { key: "destination", locale: entry.id };
    }
  }

  return null;
}

export function alternatePath(pathname: string, targetLocale: ContentLocale): string | null {
  const resolved = resolveRouteFromPath(pathname);
  if (!resolved) {
    return localeHomePath(targetLocale);
  }
  if (resolved.key === "destination") {
    const slug = pathname.split("/").filter(Boolean).pop();
    if (!slug) return destinationDirectory(targetLocale);
    return `${destinationDirectory(targetLocale)}/${slug}`;
  }
  return getRoute(resolved.key).paths[targetLocale];
}

export const INDEXABLE_STATIC_ROUTES = STATIC_ROUTES.filter((entry) => entry.indexable);

export const GUIDE_ROUTE_KEYS: Exclude<GuideRouteKey, "home">[] = [
  "about",
  "howItWorks",
  "paraglidingWeather",
  "whenToFly",
  "flightWindow",
  "faq",
];

export const DYNAMIC_CONTENT_LOCALES = CONTENT_LOCALES.filter(
  (entry) => entry.id !== "en" && entry.id !== "ro",
);

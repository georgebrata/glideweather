import type { MetadataRoute } from "next";
import { DESTINATIONS } from "./content/destinations";
import { resolveSiteOrigin } from "./brand";
import { CONTENT_LOCALES } from "../content-locales";
import { hreflangCode } from "./seo/locale";
import { destinationDirectory, INDEXABLE_STATIC_ROUTES } from "./seo/routes";
import type { ContentLocale } from "./seo/types";

const siteOrigin = resolveSiteOrigin();

function alternatesFor(paths: Record<ContentLocale, string>) {
  const languages: Record<string, string> = {
    "x-default": `${siteOrigin}${paths.en}`,
  };
  for (const entry of CONTENT_LOCALES) {
    languages[hreflangCode(entry.id)] = `${siteOrigin}${paths[entry.id]}`;
  }
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = INDEXABLE_STATIC_ROUTES.flatMap((route) =>
    CONTENT_LOCALES.map((entry) => ({
      url: `${siteOrigin}${route.paths[entry.id]}`,
      lastModified: new Date(),
      changeFrequency: route.key === "home" ? ("daily" as const) : ("monthly" as const),
      priority: route.key === "home" ? 1 : 0.7,
      alternates: alternatesFor(route.paths),
    })),
  );

  const destinationEntries: MetadataRoute.Sitemap = DESTINATIONS.flatMap((destination) => {
    const paths = Object.fromEntries(
      CONTENT_LOCALES.map((entry) => [
        entry.id,
        `${destinationDirectory(entry.id)}/${destination.slug}`,
      ]),
    ) as Record<ContentLocale, string>;
    return CONTENT_LOCALES.map((entry) => ({
      url: `${siteOrigin}${paths[entry.id]}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: alternatesFor(paths),
    }));
  });

  return [...staticEntries, ...destinationEntries];
}

import type { MetadataRoute } from "next";
import { DESTINATIONS } from "./content/destinations";
import { resolveSiteOrigin } from "./brand";
import { INDEXABLE_STATIC_ROUTES } from "./seo/routes";
import type { ContentLocale } from "./seo/types";

const siteOrigin = resolveSiteOrigin();

function alternatesFor(paths: Record<ContentLocale, string>) {
  return {
    languages: {
      en: `${siteOrigin}${paths.en}`,
      ro: `${siteOrigin}${paths.ro}`,
      "x-default": `${siteOrigin}${paths.en}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = INDEXABLE_STATIC_ROUTES.map((route) => ({
    url: `${siteOrigin}${route.paths.en}`,
    lastModified: new Date(),
    changeFrequency: route.key === "home" ? "daily" : "monthly",
    priority: route.key === "home" ? 1 : 0.7,
    alternates: alternatesFor(route.paths),
  }));

  const destinationEntries: MetadataRoute.Sitemap = DESTINATIONS.flatMap((destination) => {
    const paths = {
      en: `/destinations/${destination.slug}`,
      ro: `/ro/destinatii/${destination.slug}`,
    };
    return [
      {
        url: `${siteOrigin}${paths.en}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: alternatesFor(paths),
      },
    ];
  });

  return [...staticEntries, ...destinationEntries];
}

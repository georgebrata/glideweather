import type { MetadataRoute } from "next";
import { resolveSiteOrigin } from "./brand";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = resolveSiteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up", "/profile"],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}

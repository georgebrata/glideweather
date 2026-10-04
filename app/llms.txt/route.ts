import { INDEXABLE_STATIC_ROUTES, pathForRoute } from "../seo/routes";
import { DESTINATIONS } from "../content/destinations";
import { resolveSiteOrigin } from "../brand";
import { CONTENT_LOCALES } from "../../content-locales";

export function GET() {
  const origin = resolveSiteOrigin();
  const lines = [
    "# GlideWeather",
    "",
    "> GlideWeather is a paragliding weather console. It provides forecast-based decision support, not flight authorization.",
    "",
    "## Primary pages",
    "",
    ...INDEXABLE_STATIC_ROUTES.flatMap((route) =>
      CONTENT_LOCALES.map((entry) => `- ${origin}${route.paths[entry.id]}`),
    ),
    "",
    "## Destinations",
    "",
    ...DESTINATIONS.map(
      (d) => `- ${origin}/destinations/${d.slug} — ${d.names.en}`,
    ),
    "",
    ...CONTENT_LOCALES.map(
      (entry) => `Home (${entry.nativeName}): ${origin}${pathForRoute("home", entry.id)}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { INDEXABLE_STATIC_ROUTES, pathForRoute } from "../seo/routes";
import { DESTINATIONS } from "../content/destinations";
import { resolveSiteOrigin } from "../brand";

export function GET() {
  const origin = resolveSiteOrigin();
  const lines = [
    "# GlideWeather",
    "",
    "> GlideWeather is a paragliding weather console. It provides forecast-based decision support, not flight authorization.",
    "",
    "## Primary pages",
    "",
    ...INDEXABLE_STATIC_ROUTES.flatMap((route) => [
      `- ${origin}${route.paths.en}`,
      `- ${origin}${route.paths.ro}`,
    ]),
    "",
    "## Destinations",
    "",
    ...DESTINATIONS.map(
      (d) => `- ${origin}/destinations/${d.slug} — ${d.names.en}`,
    ),
    "",
    `Home (English): ${origin}${pathForRoute("home", "en")}`,
    `Home (Romanian): ${origin}${pathForRoute("home", "ro")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

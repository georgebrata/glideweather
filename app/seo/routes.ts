import type { ContentLocale } from "./types";
import type { GuideRouteKey, StaticRouteKey } from "./types";

export type RouteDefinition = {
  key: StaticRouteKey;
  paths: Record<ContentLocale, string>;
  indexable: boolean;
  titles: Record<ContentLocale, string>;
  descriptions: Record<ContentLocale, string>;
};

const route = (
  key: StaticRouteKey,
  paths: Record<ContentLocale, string>,
  titles: Record<ContentLocale, string>,
  descriptions: Record<ContentLocale, string>,
  indexable = true,
): RouteDefinition => ({
  key,
  paths,
  indexable,
  titles,
  descriptions,
});

export const STATIC_ROUTES: RouteDefinition[] = [
  route(
    "home",
    { en: "/", ro: "/ro" },
    {
      en: "GlideWeather | Paragliding weather and flight conditions",
      ro: "GlideWeather | Meteo parapantă și condiții de zbor",
    },
    {
      en:
        "Hyperlocal paragliding weather: wind, gusts, visibility, and instability combined into a flight confidence score and launch-window guidance.",
      ro:
        "Meteo hiperlocală pentru parapantă: vânt, rafale, vizibilitate și instabilitate într-un scor de încredere și ghidaj pentru fereastra de zbor.",
    },
  ),
  route(
    "about",
    { en: "/about", ro: "/ro/despre" },
    {
      en: "About GlideWeather | Paragliding weather decision support",
      ro: "Despre GlideWeather | Ajutor la decizie meteo pentru parapantă",
    },
    {
      en:
        "What GlideWeather is, who it is for, and how hyperlocal forecast signals help paraglider pilots compare conditions before travelling to a launch site.",
      ro:
        "Ce este GlideWeather, pentru cine este și cum semnalele meteo hiperlocale ajută piloții să compare condițiile înainte de a merge la decolare.",
    },
  ),
  route(
    "howItWorks",
    { en: "/how-it-works", ro: "/ro/cum-functioneaza" },
    {
      en: "How GlideWeather works | From location to flight window",
      ro: "Cum funcționează GlideWeather | De la locație la fereastra de zbor",
    },
    {
      en:
        "How GlideWeather turns launch-site coordinates into forecast data, flying-condition signals, and a conservative flight-window interpretation.",
      ro:
        "Cum transformă GlideWeather coordonatele într-o prognoză, semnale de zbor și o interpretare conservatoare a ferestrei de zbor.",
    },
  ),
  route(
    "paraglidingWeather",
    { en: "/paragliding-weather", ro: "/ro/meteo-parapanta" },
    {
      en: "Paragliding weather guide | Wind, gusts, and instability",
      ro: "Ghid meteo parapantă | Vânt, rafale și instabilitate",
    },
    {
      en:
        "Understand which weather parameters GlideWeather uses for paragliding—wind at 10 m, gust spread, visibility, precipitation, and CAPE—and how they affect the score.",
      ro:
        "Parametrii meteo folosiți de GlideWeather pentru parapantă—vânt la 10 m, rafale, vizibilitate, precipitații și CAPE—și cum influențează scorul.",
    },
  ),
  route(
    "whenToFly",
    { en: "/when-to-fly", ro: "/ro/cand-sa-zbori" },
    {
      en: "When to check paragliding weather | Planning a flying day",
      ro: "Când să verifici meteo pentru parapantă | Planificarea zilei de zbor",
    },
    {
      en:
        "Practical times to use GlideWeather: before travel, when comparing launch sites, and while monitoring changing wind and weather through the day.",
      ro:
        "Momente practice pentru GlideWeather: înainte de drum, la compararea site-urilor și când urmărești schimbările de vânt și vreme.",
    },
  ),
  route(
    "flightWindow",
    { en: "/flight-window", ro: "/ro/fereastra-de-zbor" },
    {
      en: "What is a paragliding flight window? | GlideWeather",
      ro: "Ce este fereastra de zbor parapantă? | GlideWeather",
    },
    {
      en:
        "How GlideWeather defines a flight window: the 0–100 score, favorable-until timing, and ranked daylight hours that pass conservative filters.",
      ro:
        "Cum definește GlideWeather fereastra de zbor: scorul 0–100, intervalul „favorabil până la” și orele de zi care trec filtrele conservatoare.",
    },
  ),
  route(
    "faq",
    { en: "/faq", ro: "/ro/intrebari-frecvente" },
    {
      en: "Paragliding weather FAQ | GlideWeather",
      ro: "Întrebări frecvente meteo parapantă | GlideWeather",
    },
    {
      en:
        "Answers about flight windows, wind limits, forecast sources, launch sites, accuracy, and why GlideWeather is a decision aid—not flight authorization.",
      ro:
        "Răspunsuri despre ferestre de zbor, vânt, surse de prognoză, site-uri de decolare, acuratețe și de ce GlideWeather este ajutor la decizie, nu autorizare.",
    },
  ),
  route(
    "destinationsHub",
    { en: "/destinations", ro: "/ro/destinatii" },
    {
      en: "Popular paragliding destinations | GlideWeather",
      ro: "Destinații populare parapantă | GlideWeather",
    },
    {
      en:
        "Explore well-known paragliding flying areas worldwide and open hyperlocal weather for each reference launch region.",
      ro:
        "Explorează zone cunoscute de zbor parapantă și deschide meteo hiperlocală pentru fiecare regiune de referință.",
    },
  ),
  route(
    "notFound",
    { en: "/404", ro: "/ro/404" },
    {
      en: "Page not found | GlideWeather",
      ro: "Pagină negăsită | GlideWeather",
    },
    {
      en: "The page you requested is not available.",
      ro: "Pagina solicitată nu este disponibilă.",
    },
    false,
  ),
];

const routesByKey = new Map(STATIC_ROUTES.map((entry) => [entry.key, entry]));

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

export function resolveRouteFromPath(pathname: string): {
  key: StaticRouteKey | "destination";
  locale: ContentLocale;
} | null {
  const normalized = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  for (const entry of STATIC_ROUTES) {
    if (entry.paths.en === normalized) {
      return { key: entry.key, locale: "en" };
    }
    if (entry.paths.ro === normalized) {
      return { key: entry.key, locale: "ro" };
    }
  }

  const enDestMatch = /^\/destinations\/([^/]+)$/.exec(normalized);
  if (enDestMatch) {
    return { key: "destination", locale: "en" };
  }
  const roDestMatch = /^\/ro\/destinatii\/([^/]+)$/.exec(normalized);
  if (roDestMatch) {
    return { key: "destination", locale: "ro" };
  }

  return null;
}

export function alternatePath(pathname: string, targetLocale: ContentLocale): string | null {
  const resolved = resolveRouteFromPath(pathname);
  if (!resolved) {
    return targetLocale === "en" ? "/" : "/ro";
  }
  if (resolved.key === "destination") {
    const slug = pathname.split("/").pop();
    if (!slug) return targetLocale === "en" ? "/destinations" : "/ro/destinatii";
    return targetLocale === "en" ? `/destinations/${slug}` : `/ro/destinatii/${slug}`;
  }
  return getRoute(resolved.key).paths[targetLocale];
}

export const INDEXABLE_STATIC_ROUTES = STATIC_ROUTES.filter((entry) => entry.indexable);

export const GUIDE_ROUTE_KEYS: GuideRouteKey[] = [
  "about",
  "howItWorks",
  "paraglidingWeather",
  "whenToFly",
  "flightWindow",
  "faq",
];

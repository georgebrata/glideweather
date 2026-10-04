export type ContentLocale = "en" | "ro";

export const CONTENT_LOCALE_HEADER = "x-content-locale";

export type GuideRouteKey =
  | "home"
  | "about"
  | "howItWorks"
  | "paraglidingWeather"
  | "whenToFly"
  | "flightWindow"
  | "faq"
  | "destinationsHub";

export type StaticRouteKey = GuideRouteKey | "notFound";

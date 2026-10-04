export type { ContentLocale, CopyLocale } from "../../content-locales";
export { CONTENT_LOCALE_IDS, COPY_LOCALES, isContentLocale } from "../../content-locales";

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

export type StaticRouteKey = GuideRouteKey | "feedback" | "notFound";

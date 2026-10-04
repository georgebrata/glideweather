import type { ContentLocale } from "./types";

export function contentLocaleFromPathname(pathname: string): ContentLocale {
  if (pathname === "/ro" || pathname.startsWith("/ro/")) {
    return "ro";
  }
  return "en";
}

export function documentLang(locale: ContentLocale): string {
  return locale === "ro" ? "ro" : "en";
}

export function hreflangCode(locale: ContentLocale): string {
  return locale === "ro" ? "ro" : "en";
}

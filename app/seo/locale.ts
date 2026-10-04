import { contentLocaleDefinition, contentLocaleFromPathname as fromPath } from "../../content-locales";
import type { ContentLocale } from "./types";

export function contentLocaleFromPathname(pathname: string): ContentLocale {
  return fromPath(pathname);
}

export function documentLang(locale: ContentLocale): string {
  return contentLocaleDefinition(locale).htmlLang;
}

export function hreflangCode(locale: ContentLocale): string {
  return contentLocaleDefinition(locale).hreflang;
}

export function openGraphLocale(locale: ContentLocale): string {
  return contentLocaleDefinition(locale).openGraphLocale;
}
